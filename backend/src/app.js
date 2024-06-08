import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authRoute } from "./routes/auth.routes.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { userRouter } from "./routes/user.routes.js";
import { protectedRoute } from "./middlewares/auth.middleware.js";
import { PostRouter } from "./routes/post.routes.js";
import { NotificationRouter } from "./routes/notification.routes.js";
import { fileURLToPath } from "url";
import path from "path";
import { dirname } from "path";

export const app = express();
const cors_origin = process.env.CORS_ORIGIN;

//cors
app.use(
  cors({
    origin: cors_origin, // Ensure this matches the frontend origin exactly
    credentials: true,
  })
);
//json
app.use(
  express.json({
    limit: "10mb",
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//routes
//auth
app.use("/api/v1/auth", authRoute);
//user
app.use("/api/v1/user", protectedRoute, userRouter);
//post
app.use("/api/v1/posts", protectedRoute, PostRouter);
//notification routes
app.use("/api/v1/notification", protectedRoute, NotificationRouter);

if (process.env.NODE_ENV === "PRODUCTION") {
  app.use(express.static(path.join(__dirname, "..", "..", "./frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(
      path.resolve(__dirname, "..", "..", "frontend", "dist", "index.html")
    );
  });
}

//middleware
app.use(errorMiddleware);
