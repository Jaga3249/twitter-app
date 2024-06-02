import { Router } from "express";
import {
  followUnFollowUser,
  getUserProfile,
  suggestedUser,
  updateUser,
} from "../controllers/user.controller.js";
export const userRouter = Router();
//get user-profile
userRouter.route("/profile/:username").get(getUserProfile);
//follow-unfollow user
userRouter.route("/follow/:id").post(followUnFollowUser);
//suggested user
userRouter.route("/suggested").get(suggestedUser);
//update user
userRouter.route("/update").post(updateUser);
