import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI;
        if (!mongoURI) {
            throw new Error("MONGO_URI is required");
        }
        const conn = await mongoose.connect(mongoURI);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        throw new Error(`MongoDB connection failed: ${message}`);
    }
}

export default connectDB;
