"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = require("../app");
async function dropDB() {
    try {
        await (0, app_1.connectDB)();
        if (mongoose_1.default.connection.db) {
            await mongoose_1.default.connection.db.dropDatabase();
            console.log("Tables dropped");
        }
        await mongoose_1.default.disconnect();
        process.exit(0);
    }
    catch (error) {
        console.error("Error dropping database:", error);
        process.exit(1);
    }
}
async function checkIndexes() {
    await (0, app_1.connectDB)();
    if (mongoose_1.default.connection.db) {
        const collections = await mongoose_1.default.connection.db.collections();
        for (const collection of collections) {
            console.log("Collection:", collection.collectionName);
            const indexes = await collection.indexes();
            console.log(indexes);
        }
    }
    await mongoose_1.default.disconnect();
}
async function main() {
    try {
        await dropDB();
        await checkIndexes(); // now this will run
        await mongoose_1.default.disconnect();
        console.log("Disconnected");
    }
    catch (err) {
        console.error(err);
    }
}
main();
//# sourceMappingURL=drop.js.map