import mongoose from "mongoose";

const connectDatabase = async () => {
  try {
    if (!process.env.MONGO_URL) {
      console.error("Error: MONGO_URL is not defined in environment variables");
      process.exit(1);
    }

    const conn = await mongoose.connect(process.env.MONGO_URL);
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1); 
  }
};

export default connectDatabase;
