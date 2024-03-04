import express from "express";
import {
  createBlog,
  getLatestBlogs,
  getTrendingBlogs,
} from "../controllers/blog.controller.js";
import { Auth } from "../middleware/auth.middleware.js";

const blogRouter = express.Router();

blogRouter.get("/latest-blogs", getLatestBlogs);
blogRouter.get("/trending-blogs", getTrendingBlogs);
blogRouter.post("/create", Auth, createBlog);

export default blogRouter;
