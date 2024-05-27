// import { v2 as cloudinary } from "cloudinary";
// import fs from "fs";

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View Credentials' below to copy your API secret
// });
// export const uploadCloudinary = async (localPath) => {
//   try {
//     if (!localPath) return null;
//     const response = await cloudinary.uploader.upload(localPath);
//     fs.unlinkSync(localPath);
//     return response;
//   } catch (error) {
//     console.log(error.message || "something went wrong ");
//     fs.unlink(loa)
//   }
// };
