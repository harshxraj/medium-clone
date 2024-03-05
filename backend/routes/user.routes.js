import express from "express";
import {
  getProfileOfUser,
  searchUser,
} from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.post("/search", searchUser);
userRouter.post("/profile", getProfileOfUser);

export default userRouter;
