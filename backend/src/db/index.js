import mongoose from "mongoose";

export const dbConnect = async () => {
  try {
    const mongo_url = process.env.MONGO_URI;
    const connectionInstance = await mongoose.connect(mongo_url);
    console.log(
      `\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MongoDb connection error !!", error.message);
    process.exit(1);
  }
};
