import { Router } from "express";
import {
  changePassword,
  getMe,
  logOut,
  login,
  signup,
} from "../controllers/auth.controller.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";
const authRoute = Router();

//routes
authRoute.route("/sign-up").post(signup);
authRoute.route("/login").post(login);
authRoute.route("/logout").get(logOut);
authRoute.route("/me").get(protectedRoute, getMe);
authRoute.route("/change-password").post(protectedRoute, changePassword);

export { authRoute };
