import mongoose from "mongoose";

export async function dbConnect() {
    // If already connected, skip reconnection
    if (mongoose.connection.readyState === 1) {
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI!);
        console.log("Database connected");
    } catch (error: any) {
        console.error("Database connection failed:", error);
        throw new Error(`Database connection failed: ${error.message}`);
    }
}