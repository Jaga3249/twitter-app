import Notification from "../models/notification.models.js";
import Post from "../models/post.models.js";
import User from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { v2 as cloudinary } from "cloudinary";

//create post
export const createPost = asyncHandler(async (req, res) => {
  const { text } = req.body;
  let { img } = req.body;
  const userId = req.user._id.toString();
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(0, "user is not found", 404);
  }
  if (img) {
    const response = await cloudinary.uploader.upload(img);
    img = response.secure_url;
  }
  console.log(img);
  if (!text && !img) {
    throw new ApiError(0, "please provide text and image ", 400);
  }
  const newPost = new Post({
    user: userId,
    text,
    img,
  });
  await newPost.save();
  const createPost = await Post.findById(newPost._id);
  return res
    .status(200)
    .json(
      new ApiResponse(1, "post created sucessfully", 201, { post: createPost })
    );
});

export const deletePost = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(0, "post is not found", 400);
  }

  if (post.user?.toString() != req.user?._id?.toString()) {
    throw new ApiError(0, "you are not authorized to delete this post", 201);
  }
  if (post.img) {
    const imgId = post.img.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(imgId);
  }
  //post delete
  await Post.findByIdAndDelete(postId);
  return res
    .status(200)
    .json(new ApiResponse(1, "post deleted sucessfully", 201));
});

export const commentPost = asyncHandler(async (req, res) => {
  const { text } = req.body;
  const postId = req.params.id;
  const userId = req.user._id;
  if (!text) {
    throw new ApiError(0, "Text is required", 400);
  }

  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(0, "post is not found", 400);
  }
  const comment = { text, user: userId };
  //   post.comments.push(comment);
  //   await post.save();
  await Post.updateOne({ _id: postId }, { $push: { comments: comment } });
  const updatedPost = await Post.findById(postId);
  console.log(updatedPost);
  return res.status(200).json(
    new ApiResponse(1, "comment created for the post sucessfully", 201, {
      post: updatedPost,
    })
  );
});

export const likeUnLikePost = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const userId = req.user._id;
  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(0, "post is not found", 404);
  }
  const likedPost = post.likes.includes(userId);
  if (likedPost) {
    //unlike
    await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
    await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });

    const updatedPost = await Post.findById(postId);

    return res.status(200).json(
      new ApiResponse(1, "Post unliked sucessfully", 201, {
        post: updatedPost,
      })
    );
  } else {
    // like
    post.likes.push(userId);
    await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } });
    await post.save();
    const newNotification = new Notification({
      from: userId,
      to: post.user,
      type: "like",
    });
    await newNotification.save();
    return res
      .status(200)
      .json(new ApiResponse(1, "Post liked sucessfully", 201, { post }));
  }
});

export const getAllPost = asyncHandler(async (req, res) => {
  const posts = await Post.find({})
    .sort({ createdAt: -1 })
    .populate({
      path: "user",
      select: "-password -createdAt -updatedAt -__v",
    })
    .populate({
      path: "comments.user",
      select: "-password -createdAt -updatedAt -__v",
    });
  if (posts.length === 0) {
    throw new ApiError(0, "Please create a post", 400);
  }
  return res
    .status(200)
    .json(new ApiResponse(1, "all posts retrived sucessfully", 201, { posts }));
});
export const getLikedPosts = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const users = await User.findById(userId);

  if (!users) {
    throw new ApiError(0, "user is not found", 404);
  }
  const likedPost = await Post.find({
    _id: { $in: users.likedPosts },
  })
    .populate({
      path: "user",
      select: "-password -createdAt -updatedAt -__v",
    })
    .populate({
      path: "comments.user",
      select: "-password -createdAt -updatedAt -__v",
    });

  return res
    .status(200)
    .json(
      new ApiResponse(1, "all posts retrived sucessfully", 201, { likedPost })
    );
});

export const getFollowingPosts = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(0, "user is not found", 404);
  }
  const following = user.following;
  const feedPosts = await Post.find({
    user: { $in: following },
  })
    .populate({
      path: "user",
      select: "-password -createdAt -updatedAt -__v",
    })
    .populate({
      path: "comments.user",
      select: "-password -createdAt -updatedAt -__v",
    });
  return res.status(200).json(
    new ApiResponse(1, "following users posts found sucessfully", 201, {
      posts: feedPosts,
    })
  );
});

export const getUserPosts = asyncHandler(async (req, res) => {
  const username = req.params.username;

  const user = await User.findOne({ username });

  if (!user) {
    throw new ApiError(0, "user is npt found", 404);
  }
  const posts = await Post.find({ user: user?._id })
    .populate({
      path: "user",
      select: "-password -createdAt -updatedAt -__v",
    })
    .populate({
      path: "comments.user",
      select: "-password -createdAt -updatedAt -__v",
    });
  return res
    .status(200)
    .json(new ApiResponse(0, "user post retrived sucessfully", 201, { posts }));
});
