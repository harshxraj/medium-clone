import express from "express";
import {
  createBlog,
  getBlog,
  getLatestBlogs,
  getLatestBlogsCount,
  getTrendingBlogs,
  searchBlogs,
  searchBlogsCount,
} from "../controllers/blog.controller.js";
import { Auth } from "../middleware/auth.middleware.js";

const blogRouter = express.Router();

blogRouter.post("/latest-blogs", getLatestBlogs);
blogRouter.get("/trending-blogs", getTrendingBlogs);
blogRouter.post("/all-latest-blogs-count", getLatestBlogsCount);
blogRouter.post("/search-blogs-count", searchBlogsCount);

blogRouter.post("/search-blogs", searchBlogs);

blogRouter.post("/", getBlog);
blogRouter.post("/create", Auth, createBlog);

export default blogRouter;

// getting the blog -> import.meta.env.VITE_BASE_URL/blog/
