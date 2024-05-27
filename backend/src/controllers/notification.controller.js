import Notification from "../models/notification.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getNotification = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const notification = await Notification.find({ to: userId }).populate({
    path: "from",
    select: "username profileImg",
  });
  const updateNotification = await Notification.updateMany(
    { to: userId },
    { read: true }
  );
  return res.status(200).json(
    new ApiResponse(1, "notification read sucessfully", 201, {
      notification: notification,
    })
  );
});

export const deleteNotofication = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  await Notification.deleteMany({ to: userId });
  return res
    .status(200)
    .json(new ApiResponse(1, "notification deleted sucessfully", 201));
});
