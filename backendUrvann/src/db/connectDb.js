import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MongoDB_URL);
        console.log("Connected to Database");
    } catch (error) {
        console.log("Connection Failed" , error);
        process.exit(1);
    }
}