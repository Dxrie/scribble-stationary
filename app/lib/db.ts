import mongoose from "mongoose";
import "dotenv/config";

const MONGO_URI = process.env.MONGO_URI || "";

const connect = async () => {
    const connectionState = await mongoose.connection.readyState;

    if (connectionState === 1) {
        console.log("Already connected");
        return;
    }

    if (connectionState === 2) {
        console.log("Connecting...");
        return;
    }

    try {
        mongoose.connect(MONGO_URI, {
            dbName: "db-scribble",
            bufferCommands: true,
        });

        console.log("Connected");
    } catch (err) {
        const errorMessage = "Error: " + err;

        console.log(errorMessage);
        throw new Error(errorMessage);
    }
}

export default connect;