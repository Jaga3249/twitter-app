import User from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import bcrypt from "bcrypt";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { ApiResponse } from "../utils/ApiResponse.js";

//sign-up user
export const signup = asyncHandler(async (req, res) => {
  const { username, fullname, email, password } = req.body;

  if (
    [username, fullname, email, password].some(
      (fields) => fields?.trim() === ""
    )
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
  if (existUser) {
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
  if (!newUser) {
    throw new ApiError(0, "Invalid user data", 400);
  }
  generateTokenAndSetCookie(newUser._id, res);
  await newUser.save();
  const createdUser = await User.findById(newUser._id).select(
    "-password -createdAt -updatedAt -__v"
  );

  return res
    .status(200)
    .json(
      new ApiResponse(1, "user created sucessfully", 201, { user: createdUser })
    );
});
//login user
export const login = asyncHandler(async (req, res) => {
  const { usernameOrEmail, password } = req.body;

  if ([usernameOrEmail, password].some((fields) => fields.trim() === "")) {
    throw new ApiError(0, "All fields are required", 400);
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmail = emailRegex.test(usernameOrEmail);

  const user = await User.findOne(
    isEmail ? { email: usernameOrEmail } : { username: usernameOrEmail }
  );
  if (!user) {
    throw new ApiError(0, "Invalid credential", 400);
  }
  const checkPassword = await bcrypt.compare(password, user.password);
  if (!checkPassword) {
    throw new ApiError(0, "Invalid credential", 400);
  }
  generateTokenAndSetCookie(user._id, res);
  const logginUser = await User.findById(user._id).select(
    "-password -createdAt -updatedAt -__v"
  );

  return res.status(200).json(
    new ApiResponse(1, "user logged in sucessfully", 201, {
      user: logginUser,
    })
  );
});
//logout
export const logOut = asyncHandler(async (req, res) => {
  const option = {
    maxAge: 0, //MS
    httpOnly: true, // prevent XSS attacks cross-site scripting attacks
    sameSite: "strict", // CSRF attacks cross-site request forgery attacks
    secure: process.env.ENV_MODE != "DEVELOPMENT",
  };
  return res
    .status(200)
    .clearCookie("jwt", option)
    .json(new ApiResponse(200, "user logout sucessfully", 201, null));
});

//get profile
export const getMe = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId).select(
    "-password -createdAt -updatedAt -__v"
  );
  if (!user) {
    throw new ApiError(0, "user is not found", 404);
  }
  return res
    .status(200)
    .json(new ApiResponse(1, "user info retrived sucessfully", 201, { user }));
});

//change password
export const changePassword = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { newPassword, oldPassword } = req.body;
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(0, "user is not found", 404);
  }
  const match = await bcrypt.compare(oldPassword, user.password);
  if (!match) {
    throw new ApiError(0, "oldpassword is incorrect", 404);
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);
  user.password = hashedPassword;
  await user.save();
  return res
    .status(200)
    .json(new ApiResponse(1, "password reset sucessfully", 201));
});
