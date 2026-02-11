import mongoose from "mongoose"

import { connectDB, mongoDB, } from '../app';



async function dropDB() {
    try {
        await connectDB()

        if (mongoose.connection.db) {
            await mongoose.connection.db.dropDatabase()
            console.log("Tables dropped")
        }

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error("Error dropping database:", error);
        process.exit(1);
    }
}
async function checkIndexes() {
    await connectDB();
    if (mongoose.connection.db) {
        const collections = await mongoose.connection.db.collections();
        for (const collection of collections) {
            console.log("Collection:", collection.collectionName);
            const indexes = await collection.indexes();
            console.log(indexes);
        }
    }
    await mongoose.disconnect();
}

async function main() {
    try {
        await dropDB();
        await checkIndexes(); // now this will run
        await mongoose.disconnect();
        console.log("Disconnected");
    } catch (err) {
        console.error(err);
    }
}

main()