import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

export const uploadCloudinary = async (localPath) => {
  try {
    if (!localPath) return null;
    const response = await cloudinary.uploader.upload(localPath);
    fs.unlinkSync(localPath);
    return response;
  } catch (error) {
    console.log(error.message || "something went wrong ");
    fs.unlink(loa);
  }
};
