import { Router } from "express";
import {
  forgotPassword,
  getProfile,
  logOut,
  login,
  resetPassword,
  signup,
} from "../controllers/auth.controller.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";
const authRoute = Router();

//routes
authRoute.route("/sign-up").post(signup);
authRoute.route("/login").post(login);
authRoute.route("/logout").get(protectedRoute, logOut);
authRoute.route("/get-profile").get(protectedRoute, getProfile);
authRoute.route("/forgot-password").post(forgotPassword);
authRoute.route("/reset-password").post(protectedRoute, resetPassword);

export { authRoute };
