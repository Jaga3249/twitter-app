import dotenv from "dotenv";
import { dbConnect } from "./db/index.js";
import { app } from "./app.js";
dotenv.config();
const PORT = process.env.PORT || 8000;
export const envMode = process.env.ENV_MODE.trim() || "PRODUCTION";
dbConnect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server is running at port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDb connection error !!", error.message);
  });
