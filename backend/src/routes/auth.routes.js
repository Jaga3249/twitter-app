import { Router } from "express";
import { signup } from "../controllers/auth.controller.js";
const authRoute = Router();

//routes
authRoute.route("/sign-up").post(signup);

export { authRoute };
