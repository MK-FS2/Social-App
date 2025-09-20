import mongoose from "mongoose";
import { AppError } from "../Utils/Error";
async function connectDB(): Promise<void> {
  try 
  {
    await mongoose.connect(process.env.DBLink as string);
    console.log("✅ Database connected successfully");
  } 
  catch (err: unknown) 
  {
    let message = "❌ Database connection";

    if (err instanceof Error) {
      message = err.message;
    }
    throw new AppError(message, 500);
  }
}

export default connectDB;
