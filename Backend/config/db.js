import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const connectDB = async () => {
  try {
    console.log("🔍 Connecting to MongoDB with:", process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected successfully 🚀");
  } catch (error) {
    console.error("❌ Mongoose connection error:", error);
    process.exit(1);
  }
};
