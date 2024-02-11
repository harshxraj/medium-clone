import express from "express";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";
import authRouter from "./routes/auth.routes.js";
import bodyParser from "body-parser";
import connection from "./db/connection.js";
import blogEditorRouter from "./routes/blogEditor.routes.js";

const server = express();
const PORT = 3000;
export const getBannerUrl = async (req, res) => {
  try {
    const { img } = req.body;

    // Input validation
    if (!img) {
      return res.status(400).json({ error: "Image data is required" });
    }

    // Upload image to Cloudinary
    const uploadedResponse = await cloudinary.uploader.upload(img);

    // Send the secure URL of the uploaded image in the response
    res.status(200).json(uploadedResponse.secure_url);
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
};
server.use(bodyParser.json({ limit: "50mb" }));
server.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
server.use(express.json());
server.use(cors());
server.use("/auth", authRouter);
// server.use("/blogEditor", blogEditorRouter);
server.use("/url", getBannerUrl);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

server.listen(PORT, () => {
  connection();
  console.log(`Listening on port ${PORT}`);
});
