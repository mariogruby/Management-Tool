import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGO_URI = process.env.MONGODB_URI 

mongoose
.connect(MONGO_URI)
.then((x) => {
    const dbName = x.connections[0].name;
    console.log(dbName);
    console.log(`Connecting to Mongo! db name: "${dbName}"`);
})
.catch((err) => {
    console.error("Error connecting to Mongo", err);
});