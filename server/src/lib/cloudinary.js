import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.cloudinary_NAME,
  api_key: parseInt(process.env.cloudinary_API_KEY),
  api_secret: process.env.cloudinary_KEY_SECRET,
});

export default cloudinary;
