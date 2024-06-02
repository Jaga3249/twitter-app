import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authRoute } from "./routes/auth.routes.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { userRouter } from "./routes/user.routes.js";
import { protectedRoute } from "./middlewares/auth.middleware.js";
import { PostRouter } from "./routes/post.routes.js";
import { NotificationRouter } from "./routes/notification.routes.js";
export const app = express();

//cors
app.use(
  cors({
    origin: "http://localhost:3000", // Ensure this matches the frontend origin exactly
    credentials: true,
  })
);
//json
app.use(
  express.json({
    limit: "6mb",
  })
);
//url encoded
app.use(
  express.urlencoded({
    limit: "16kb",
    extended: true,
  })
);
//cookie parser
app.use(cookieParser());

//routes
//auth
app.use("/api/v1/auth", authRoute);
//user
app.use("/api/v1/user", protectedRoute, userRouter);
//post
app.use("/api/v1/posts", protectedRoute, PostRouter);
//notification routes
app.use("/api/v1/notification", protectedRoute, NotificationRouter);

//middleware
app.use(errorMiddleware);
