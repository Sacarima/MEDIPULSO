import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_CONNECTING_STRING;
  if (!mongoURI) {
    console.error(" MONGODB_CONNECTING_STRING is not defined in .env");
    process.exit(1);
  }

  
  mongoose.set("strictQuery", false);

  try {
    const { connection } = await mongoose.connect(mongoURI);
    console.log(` MongoDB connected: ${connection.host}`);
  } catch (error) {
    console.error("  MongoDB connection error:", error);
    process.exit(1);
  }
};

// log when the connection is lost
mongoose.connection.on("disconnected", () => {
  console.warn("  MongoDB disconnected!");
});

export default connectDB;
 ''