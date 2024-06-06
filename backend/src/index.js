import dotenv from "dotenv";
import { dbConnect } from "./db/index.js";
import { app } from "./app.js";
import { v2 as cloudinary } from "cloudinary";
dotenv.config();
const PORT = process.env.PORT || 8000;
export const envMode = process.env.NODE_ENV.trim() || "production";

//cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View Credentials' below to copy your API secret
});
dbConnect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server is running at port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDb connection error !!", error.message);
  });
