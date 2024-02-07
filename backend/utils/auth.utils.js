import User from "../Schema/User.js";
import jwt from "jsonwebtoken";
import "dotenv/config";

export const generateUsername = async (email) => {
  let username = email.split("@")[0];
  let userExists = await User.exists({
    "personal_info.username": username,
  }).then((result) => result);

  return userExists
    ? `${username}${Math.floor(Math.random() * 1000)}`
    : username;
};

export const formatDataToSend = (user) => {
  const access_token = jwt.sign(
    { id: user._id },
    process.env.SECRET_ACCESS_KEY
  );
  return {
    access_token,
    profile_img: user.personal_info.profile_img,
    username: user.personal_info.username,
    fullname: user.personal_info.fullname,
  };
};
