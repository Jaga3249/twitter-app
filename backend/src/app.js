import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authRoute } from "./routes/auth.routes.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
export const app = express();
//cors
app.use(
  cors({
    origin: "",
    credentials: true,
  })
);
//json
app.use(
  express.json({
    limit: "16kb",
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
app.use("/api/v1/auth", authRoute);

//middleware
app.use(errorMiddleware);
