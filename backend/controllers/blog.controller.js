import { nanoid } from "nanoid";
import Blog from "../Schema/Blog.js";
import User from "../Schema/User.js";

export const createBlog = (req, res) => {
  let authorId = req.user;

  let { title, des, banner, tags, content, draft, id } = req.body;
  console.log(req.body);

  if (!title.length) {
    return res.status(403).json({ error: "You must provide a title!" });
  }

  if (!draft) {
    if (!des.length || des.length > 200) {
      return res.status(403).json({
        error: "You must provide blog description under 200 characters",
      });
    }

    if (!banner.length) {
      return res
        .status(403)
        .json({ error: "You must provide blog banner to publish it" });
    }

    if (!content.blocks.length) {
      return res
        .status(403)
        .json({ error: "There must be some blog content to publish it" });
    }

    if (!tags.length || tags.length > 10) {
      return res.status(403).json({ error: "You can provide at most 10 tags" });
    }
  }

  tags = tags.map((tag) => tag.toLowerCase());

  let blog_id =
    id ||
    title
      .replace(/[^a-zA-Z0-9]/g, " ")
      .replace(/\s+/g, "-")
      .trim() + nanoid();

  // console.log(id, blog_id);

  if (id) {
    Blog.findOneAndUpdate(
      { blog_id },
      { title, des, banner, content, tags, draft: draft ? draft : false }
    )
      .then(() => {
        return res.status(200).json({ id: blog_id });
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({ error: err.message });
      });
  } else {
    let blog = new Blog({
      title,
      des,
      banner,
      content,
      tags,
      author: authorId,
      blog_id,
      draft: Boolean(draft),
    });

    blog
      .save()
      .then((blog) => {
        let incrementVal = draft ? 0 : 1;
        User.findOneAndUpdate(
          { _id: authorId },
          {
            $inc: { "account_info.total_posts": incrementVal },
            $push: { blogs: blog._id },
          }
        )
          .then((user) => {
            return res.status(200).json({ id: blog.blog_id });
          })
          .catch((err) => {
            return res
              .status(500)
              .json({ error: "Failed to update total posts number" });
          });
      })
      .catch((err) => {
        return res.status(500).json({ error: err.message });
      });
  }
};

export const getLatestBlogs = (req, res) => {
  let { page } = req.body;

  let maxLimit = 5;
  Blog.find({ draft: false })
    .populate(
      "author",
      "personal_info.profile_img personal_info.username personal_info.fullname -_id"
    )
    .sort({ publishedAt: -1 })
    .select("blog_id title des banner activity tags publishedAt -_id")
    .skip((page - 1) * maxLimit)
    .limit(maxLimit)
    .then((blogs) => {
      return res.status(200).json({ blogs });
    })
    .catch((err) => {
      return res.status(500).json("Error while getting latest blogs!");
    });
};

export const getTrendingBlogs = (req, res) => {
  Blog.find({ draft: false })
    .populate(
      "author",
      "personal_info.profile_img personal_info.username personal_info.fullname -_id"
    )
    .sort({
      "activity.total_read": -1,
      "activity.total_likes": -1,
      publishedAt: -1,
    })
    .select("blog_id title publishedAt -_id")
    .limit(5)
    .then((blogs) => {
      return res.status(200).json({ blogs });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
};

export const searchBlogs = (req, res) => {
  let { tag, query, page, author, limit, eliminate_blog } = req.body;

  let findQuery;

  if (tag) {
    findQuery = { tags: tag, draft: false, blog_id: { $ne: eliminate_blog } };
  } else if (query) {
    findQuery = { title: new RegExp(query, "i"), draft: false };
  } else if (author) {
    findQuery = { author, draft: false };
  }

  let maxLimit = limit ? limit : 2;

  Blog.find(findQuery)
    .populate(
      "author",
      "personal_info.profile_img personal_info.username personal_info.fullname -_id"
    )
    .sort({ publishedAt: -1 })
    .select("blog_id title des banner activity tags publishedAt -_id")
    .skip((page - 1) * maxLimit)
    .limit(maxLimit)
    .then((blogs) => {
      return res.status(200).json({ blogs });
    })
    .catch((err) => {
      return res.status(500).json("Error while getting latest blogs!");
    });
};

export const getLatestBlogsCount = (req, res) => {
  Blog.countDocuments({ draft: false })
    .then((count) => {
      return res.status(200).json({ totalDocs: count });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: err.message });
    });
};

export const searchBlogsCount = (req, res) => {
  const { tag, query, author } = req.body;

  let findQuery;

  if (tag) {
    findQuery = { tags: tag, draft: false };
  } else if (query) {
    findQuery = { draft: false, title: new RegExp(query, "i") };
  } else if (author) {
    findQuery = { author, draft: false };
  }

  Blog.countDocuments(findQuery)
    .then((count) => {
      return res.status(200).json({ totalDocs: count });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: err.message });
    });
};

export const getBlog = (req, res) => {
  const { blog_id, draft, mode } = req.body;

  let incrementVal = mode != "edit" ? 1 : 0;

  // Incrementing the total reads of that blog
  Blog.findOneAndUpdate(
    { blog_id },
    { $inc: { "activity.total_reads": incrementVal } }
  )
    .populate(
      "author",
      "personal_info.profile_img personal_info.username personal_info.fullname"
    )
    .select("title des content banner activity publishedAt blog_id tags")
    .then((blog) => {
      // And whoever was the author of that blog, we will also increase the total read value from their profile.
      User.findOneAndUpdate(
        { "personal_info.username": blog.author.personal_info.username },
        {
          $inc: { "account_info.total_reads": incrementVal },
        }
      ).catch((err) => {
        return res.status(500).json({ error: err.message });
      });
      if (blog.draft && !draft) {
        return res.status(500).json({ error: "You can not acces draft blog" });
      }
      return res.status(200).json({ blog });
    })
    .catch((err) => {
      console.log(err);
      return res.status(200).json({ error: err.message });
    });
};
