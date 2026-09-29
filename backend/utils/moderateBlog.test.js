import assert from "node:assert/strict";
import test from "node:test";
import {
  buildBlogModerationInput,
  moderateBlog,
} from "./moderateBlog.js";

const blog = {
  title: "Safe <b>title</b>",
  des: "Description",
  tags: ["tech"],
  banner: "https://res.cloudinary.com/demo/image/upload/banner.jpg",
  content: {
    blocks: [
      { type: "paragraph", data: { text: "Hello <i>world</i>" } },
      {
        type: "image",
        data: {
          file: {
            url: "https://res.cloudinary.com/demo/image/upload/body.jpg",
          },
          caption: "caption",
        },
      },
    ],
  },
};

test("builds moderation input from blog text and images", () => {
  const input = buildBlogModerationInput(blog);

  assert.equal(input[0].type, "text");
  assert.match(input[0].text, /Safe title/);
  assert.match(input[0].text, /Hello world/);
  assert.equal(
    input.filter((item) => item.type === "image_url").length,
    2
  );
});

test("returns safe and flagged moderation decisions", async () => {
  process.env.OPENAI_API_KEY = "test-key";

  const safe = await moderateBlog(blog, async () => ({
    ok: true,
    status: 200,
    json: async () => ({
      results: [{ flagged: false, categories: { violence: false } }],
    }),
  }));

  assert.equal(safe.flagged, false);

  const blocked = await moderateBlog(blog, async () => ({
    ok: true,
    status: 200,
    json: async () => ({
      results: [{ flagged: true, categories: { violence: true } }],
    }),
  }));

  assert.equal(blocked.flagged, true);
  assert.deepEqual(blocked.categories, ["violence"]);
});

test("fails closed when the moderation API returns no decision", async () => {
  process.env.OPENAI_API_KEY = "test-key";

  await assert.rejects(
    moderateBlog(blog, async () => ({
      ok: true,
      status: 200,
      json: async () => ({ results: [] }),
    })),
    { code: "MODERATION_API_ERROR" }
  );
});
