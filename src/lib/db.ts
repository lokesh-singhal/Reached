import mongoose from "mongoose";

async function dbConnect():Promise<void> {
    if(mongoose.connection.readyState === 1) {
        console.log("Already connected to the database");
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log("Database connected succesfully");

    } catch (error) {
        console.log("Failed to connect to the database", error);
        throw error;
    }
}

export default dbConnect;
