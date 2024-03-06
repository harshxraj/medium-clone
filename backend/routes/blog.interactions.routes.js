import express from "express";
import {
  isLikedByUser,
  likeBlog,
} from "../controllers/blog.inteactions.controllers.js";
import { Auth } from "../middleware/auth.middleware.js";

const blogInteractionRouter = express.Router();

blogInteractionRouter.post("/like", Auth, likeBlog);
blogInteractionRouter.post("/isLiked", Auth, isLikedByUser);

export default blogInteractionRouter;

// Like the blog `${import.meta.env.VITE_BASE_URL}/blog/like`
// Checking if the user has liked that blog - /isLiked
