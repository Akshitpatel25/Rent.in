import mongoose from "mongoose";

export async function dbConnect() {
    try {
        mongoose.connect(process.env.MONGODB_URI);
        const connection = mongoose.connection;

        connection.on("connected", () => {
            console.log("Database connected");
        })
    } catch (error) {
        throw new Error("Database connection failed");
    }
}