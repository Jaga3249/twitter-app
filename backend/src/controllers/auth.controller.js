import User from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import bcrypt from "bcrypt";

//sign-up user
export const signup = asyncHandler(async (req, res) => {
  const { username, fullname, email, password } = req.body;

  if (
    [username, fullname, email, password].some((fields) => fields.trim() === "")
  ) {
    throw new ApiError(0, "All fields are required", 400);
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ApiError(0, "Invalid email format", 400);
  }
  const existUser = await User.findOne({
    $or: [{ email }, { username }],
  });
  if (!existUser) {
    throw new ApiError(0, "user is already exist", 400);
  }
  if (password.length < 6) {
    throw new ApiError(0, "Password must be at least 6 characters long", 400);
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    fullname,
    email,
    username,
    password: hashedPassword,
  });
  console.log(newUser);
});
