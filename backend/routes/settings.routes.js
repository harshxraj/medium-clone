import express from "express";
import { Auth } from "../middleware/auth.middleware.js";
import {
  changePassword,
  updateProfile,
  updateProfileImg,
} from "../controllers/settings.contoller.js";

const settingRouter = express.Router();

settingRouter.post("/change-password", Auth, changePassword);
settingRouter.post("/update-profile-img", Auth, updateProfileImg);
settingRouter.post("/update-profile", Auth, updateProfile);

export default settingRouter;
// {`${import.meta.env.VITE_BASE_URL}/settings/update-profile-img`}
