import { Router } from "express";
import {
  commentPost,
  createPost,
  deletePost,
  getAllPost,
  getFollowingPosts,
  getLikedPosts,
  getUserPosts,
  likeUnLikePost,
} from "../controllers/post.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
export const PostRouter = Router();
//post route
PostRouter.route("/all").get(getAllPost);
PostRouter.route("/likes/:id").get(getLikedPosts);
PostRouter.route("/following").get(getFollowingPosts);
PostRouter.route("/user/:username").get(getUserPosts);

PostRouter.route("/create").post(upload.single("img"), createPost);
PostRouter.route("/like/:id").post(likeUnLikePost);
PostRouter.route("/comment/:id").post(commentPost);
PostRouter.route("/:id").delete(deletePost);
