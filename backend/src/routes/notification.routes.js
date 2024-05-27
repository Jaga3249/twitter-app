import { Router } from "express";
import {
  deleteNotofication,
  getNotification,
} from "../controllers/notification.controller.js";

export const NotificationRouter = Router();
//get notification
NotificationRouter.route("/").get(getNotification);
NotificationRouter.route("/").delete(deleteNotofication);
