import Notification from "../models/notification.models.js";
import User from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";

//get userprofile
export const getUserProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ username });
  if (!user) {
    throw new ApiError(0, "user is not found", 404);
  }
  const getUser = await User.findById(user._id).select(
    "-password -createdAt -updatedAt -__v"
  );
  return res.status(200).json(
    new ApiResponse(1, "user profile retrived sucessfully", 201, {
      user: getUser,
    })
  );
});
//follow-unFollow user
export const followUnFollowUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const currentUser = await User.findById(req.user?._id);
  const userToModify = await User.findById(userId);
  if (userId === req.user._id.toString()) {
    throw new ApiError(0, "You can't follow/unfollow yourself", 400);
  }
  if (!currentUser || !userToModify) {
    throw new ApiError(0, "user is not found", 404);
  }
  const isFollow = currentUser.following.includes(userId);
  if (isFollow) {
    //unfollow
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { following: userId },
    });
    await User.findByIdAndUpdate(userId, {
      $pull: { followers: req.user._id },
    });

    return res
      .status(200)
      .json(new ApiResponse(1, "user unFollowed sucessfully", 201));
  } else {
    //follow
    await User.findByIdAndUpdate(req.user._id, {
      $push: { following: userId },
    });
    await User.findByIdAndUpdate(userId, {
      $push: { followers: req.user._id },
    });
    //send notification to user
    const newNotification = new Notification({
      from: req.user._id,
      to: userId,
      type: "follow",
    });
    await newNotification.save();
    //todo send user id as response
    return res
      .status(200)
      .json(new ApiResponse(1, "user Followed sucessfully", 201));
  }
});
// get suggested user
export const suggestedUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const userFollowedByMe = await User.findById(userId).select("following");

  const users = await User.aggregate([
    {
      $match: { _id: { $ne: userId } },
    },
    {
      $sample: { size: 10 },
    },
  ]);

  const filterUsers = users.filter(
    (user) => !userFollowedByMe.following.includes(user._id)
  );
  if (filterUsers.length === 0) {
    throw new ApiError(0, "No suggested user available");
  }
  const suggestedUsers = filterUsers.slice(0, 4);
  suggestedUsers.forEach((user) => (user.password = null));
  return res.status(200).json(
    new ApiResponse(1, "suggested user retrived sucessfully", 201, {
      suggestedUsers,
    })
  );
});
//update user profile
export const updateUser = asyncHandler(async (req, res) => {
  const { fullname, email, username, currentPassword, newPassword, bio, link } =
    req.body;
  let { profileImg, coverImg } = req.body;
  const userId = req.user._id;
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(0, "user is not found", 404);
  }
  //change password
  if (
    [currentPassword, newPassword].some((password) => password?.trim() === "")
  ) {
    throw new ApiError(
      0,
      "Please provide both current password and new password",
      400
    );
  }
  if (currentPassword && newPassword) {
    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
      throw new ApiError(0, "current password is incorrect", 400);
    }
    if (newPassword.length < 6) {
      throw new ApiError(0, "Password must be atleast 6 character long", 400);
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
  }
  if (profileImg) {
    if (user.profileImg) {
      await cloudinary.uploader.destroy(
        user.profileImg.split("/").pop().split(".")[0]
      );
    }
    const response = await cloudinary.uploader.upload(profileImg);
    profileImg = response.secure_url;
  }
  if (coverImg) {
    if (user.coverImg) {
      await cloudinary.uploader.destroy(
        user.coverImg.split("/").pop().split(".")[0]
      );
    }
    const response = await cloudinary.uploader.upload(coverImg);
    coverImg = response.secure_url;
  }
  user.fullname = fullname || user.fullname;
  user.email = email || user.email;
  user.username = username || user.username;
  user.bio = bio || user.bio;
  user.link = link || user.link;
  await user.save();
  const updatedUser = await User.findById(user._id).select(
    "-password -createdAt -updatedAt -__v"
  );
  if (!updatedUser) {
    throw new ApiError(0, "user is not found ");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(1, "user info updated sucessfully", 201, { updatedUser })
    );
});
