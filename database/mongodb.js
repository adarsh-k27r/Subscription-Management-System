import mongoose from "mongoose";
import {DB_URI, NODE_ENV} from "../config/env.js";

if(!DB_URI) {
    throw new Error("DB_URI is not defined");
}

const connectDB = async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log(`Connected to MongoDB in ${NODE_ENV} mode`);
    } catch (error) {
        console.log("Error connecting to MongoDB: ", error);
        process.exit(1);
    }
}   

export default connectDB;
