import { Router } from "express";
import {
  changePassword,
  forgotPassword,
  getMe,
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
authRoute.route("/me").get(protectedRoute, getMe);
authRoute.route("/change-password").post(protectedRoute, changePassword);
authRoute.route("/forgot-password").post(forgotPassword);
authRoute.route("/reset-password").post(resetPassword);

export { authRoute };
