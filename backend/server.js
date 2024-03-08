import express from "express";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";
import authRouter from "./routes/auth.routes.js";
import bodyParser from "body-parser";
import connection from "./db/connection.js";
import blogRouter from "./routes/blog.routes.js";
import userRouter from "./routes/user.routes.js";
import blogInteractionRouter from "./routes/blog.interactions.routes.js";
import settingRouter from "./routes/settings.routes.js";

const server = express();
const PORT = 3000;

server.use(bodyParser.json({ limit: "50mb" }));
server.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
server.use(express.json());
server.use(cors());

server.use("/auth", authRouter);
server.use("/blog", blogRouter);
server.use("/user", userRouter);
server.use("/blog", blogInteractionRouter);
server.use("/settings", settingRouter);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

server.listen(PORT, () => {
  connection();
  console.log(`Listening on port ${PORT}`);
});
