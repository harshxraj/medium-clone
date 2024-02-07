import express from "express";
import cors from "cors";
import "dotenv/config";
import authRouter from "./routes/auth.routes.js";
import connection from "./db/connection.js";

const server = express();
const PORT = 3000;

server.use(express.json());
server.use(cors());
server.use("/auth", authRouter);

server.listen(PORT, () => {
  connection();
  console.log(`Listening on port ${PORT}`);
});
