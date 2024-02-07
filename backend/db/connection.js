import mongoose from "mongoose";
import "dotenv/config";

const connection = async () => {
  try {
    mongoose.connect(process.env.MONG0_DB_URI, {
      autoIndex: true,
    });
  } catch (err) {
    console.log(err);
  }
};

export default connection;
