import express from "express";
import { createBlog } from "../controllers/blog.controller.js";
import { Auth } from "../middleware/auth.middleware.js";

const blogRouter = express.Router();

blogRouter.post("/create", Auth, createBlog);

export default blogRouter;
