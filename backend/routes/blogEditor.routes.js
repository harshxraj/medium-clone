import express from "express";
import { getBannerUrl } from "../controllers/blogEditor.controller.js";

const blogEditorRouter = express.Router();

blogEditorRouter.get("/get-banner-url", getBannerUrl);

export default blogEditorRouter;
