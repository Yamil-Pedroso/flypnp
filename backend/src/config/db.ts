import mongoose, { ConnectOptions } from "mongoose";
import colors from "colors";

colors.enable();

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || "";
        const conn = await mongoose.connect(mongoURI, {
        } as ConnectOptions);
        console.log(`MongoDB Connected: ${conn.connection.host}`.yellow.bold);
    } catch (error: any) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

export default connectDB;
