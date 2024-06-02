import User from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const protectedRoute = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      throw new ApiError(0, "unAuthorize: no token is provided", 401);
    }
    const decodeVal = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decodeVal.userId).select(
      "-password -createdAt -updatedAt -__v"
    );
    if (!user) {
      throw new ApiError(0, "Invalid token", 401);
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(0, error.message || "Invalid token ", 401);
  }
});
