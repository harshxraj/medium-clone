import express from "express";
import {
  getProfileOfUser,
  searchUser,
  writtenBlogsOfUser,
  writtenBlogsOfUserCount,
} from "../controllers/user.controller.js";
import { Auth } from "../middleware/auth.middleware.js";

const userRouter = express.Router();

userRouter.post("/search", searchUser);
userRouter.post("/profile", getProfileOfUser);

userRouter.post("/written-blogs", Auth, writtenBlogsOfUser);
userRouter.post("/written-blogs-count", Auth, writtenBlogsOfUserCount);

export default userRouter;
