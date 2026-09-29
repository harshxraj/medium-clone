const MODERATION_ENDPOINT = "https://api.openai.com/v1/moderations";
const MODERATION_MODEL = "omni-moderation-latest";
const MODERATION_TIMEOUT_MS = 20_000;

const stripHtml = (value) =>
  String(value ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#39;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/\s+/g, " ")
    .trim();

const getBlocks = (content) => {
  if (Array.isArray(content)) {
    return content.flatMap((item) => getBlocks(item));
  }

  return Array.isArray(content?.blocks) ? content.blocks : [];
};

const collectText = (value, textParts) => {
  if (typeof value === "string") {
    const text = stripHtml(value);
    if (text) textParts.push(text);
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => collectText(item, textParts));
    return;
  }

  if (value && typeof value === "object") {
    Object.entries(value).forEach(([key, item]) => {
      if (!["file", "url", "embed"].includes(key)) {
        collectText(item, textParts);
      }
    });
  }
};

const isSupportedImageUrl = (value) => {
  if (typeof value !== "string") return false;

  if (value.startsWith("data:image/")) return true;

  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
};

export const buildBlogModerationInput = ({
  title,
  des,
  tags = [],
  banner,
  content,
}) => {
  const textParts = [stripHtml(title), stripHtml(des)].filter(Boolean);
  const imageUrls = new Set();

  if (isSupportedImageUrl(banner)) imageUrls.add(banner);

  getBlocks(content).forEach((block) => {
    collectText(block?.data, textParts);

    const imageUrl = block?.data?.file?.url;
    if (isSupportedImageUrl(imageUrl)) imageUrls.add(imageUrl);
  });

  tags.forEach((tag) => {
    const cleanTag = stripHtml(tag);
    if (cleanTag) textParts.push(cleanTag);
  });

  const input = [];
  const text = textParts.join("\n").trim();

  if (text) input.push({ type: "text", text });

  imageUrls.forEach((url) => {
    input.push({
      type: "image_url",
      image_url: { url },
    });
  });

  return input;
};

export const moderateBlog = async (
  blog,
  fetchImplementation = globalThis.fetch
) => {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    const error = new Error("OPENAI_API_KEY is not configured");
    error.code = "MODERATION_NOT_CONFIGURED";
    throw error;
  }

  const input = buildBlogModerationInput(blog);

  if (!input.length) {
    return { flagged: false, categories: [] };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), MODERATION_TIMEOUT_MS);

  try {
    const response = await fetchImplementation(MODERATION_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODERATION_MODEL,
        input,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const responseBody = await response.text().catch(() => "");
      const error = new Error(
        `Moderation API request failed with status ${response.status}`
      );
      error.code = "MODERATION_API_ERROR";
      error.status = response.status;
      error.details = responseBody.slice(0, 500);
      throw error;
    }

    const data = await response.json();
    const results = Array.isArray(data.results) ? data.results : [];

    if (!results.length) {
      const error = new Error("Moderation API returned no results");
      error.code = "MODERATION_API_ERROR";
      throw error;
    }

    const categories = [
      ...new Set(
        results.flatMap((result) =>
          Object.entries(result.categories ?? {})
            .filter(([, isFlagged]) => isFlagged)
            .map(([category]) => category)
        )
      ),
    ];

    return {
      flagged: results.some((result) => result.flagged),
      categories,
    };
  } finally {
    clearTimeout(timeout);
  }
};
