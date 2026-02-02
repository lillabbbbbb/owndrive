"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = require("@faker-js/faker");
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = require("../app");
const User_1 = require("../models/User");
const File_1 = require("../models/File");
const Image_1 = require("../models/Image");
const USER_COUNT = 1;
const IMAGE_COUNT = 1;
const FILE_COUNT = 10;
async function seed() {
    await (0, app_1.connectDB)();
    // 1️⃣ Clear collections
    await User_1.User.deleteMany({});
    await File_1.File.deleteMany({});
    await Image_1.Image.deleteMany({});
    // 2️⃣ Create images
    const images = await Image_1.Image.insertMany(Array.from({ length: IMAGE_COUNT }).map(() => ({
        filename: faker_1.faker.system.fileName(),
        description: faker_1.faker.lorem.sentence(),
        path: faker_1.faker.system.filePath(),
        createdAt: faker_1.faker.date.recent(),
    })));
    /*
    // 3️⃣ Create users
    const users: any[] = await User.insertMany(
      Array.from({ length: USER_COUNT }).map(() => ({
        username: faker.internet.username(),
        email: faker.helpers.arrayElement(['fake@gmail.com']),
        password_hash: 'hashed_password',
        files: [], // will push files later
        language: faker.helpers.arrayElement(['en', 'es', 'fr']),
        mode: faker.helpers.arrayElement(['light', 'dark']),
        profile_pic: faker.helpers.arrayElement(images)._id,
      }))
    );
    */
    const user = await User_1.User.findOne({ email: process.env.TEST_EMAIL });
    if (!user)
        return;
    // 4️⃣ Create files and link to users
    for (let i = 0; i < FILE_COUNT; i++) {
        const creator = faker_1.faker.helpers.arrayElement([user]);
        if (!creator)
            return;
        const file = await File_1.File.create({
            created_at: faker_1.faker.date.past(),
            created_by: creator._id,
            last_edited_at: faker_1.faker.date.recent(),
            file_type: faker_1.faker.helpers.arrayElement(['doc', 'txt', 'md']),
            filename: faker_1.faker.system.fileName(),
            content: faker_1.faker.lorem.paragraphs(2),
            visibleToGuests: faker_1.faker.datatype.boolean(),
            showsInHomeShared: faker_1.faker.datatype.boolean(),
            private: faker_1.faker.datatype.boolean(),
            status: faker_1.faker.helpers.arrayElement(['active', 'archived']),
            archivedAt: faker_1.faker.datatype.boolean() ? faker_1.faker.date.past() : undefined,
            inUse: false,
            usedBy: undefined,
        });
        // Push file to creator's files array
        user.files.push(file._id);
        await creator.save();
    }
    console.log('✅ Seed finished');
    mongoose_1.default.connection.close();
}
seed().catch(err => {
    console.error(err);
    mongoose_1.default.connection.close();
});
//# sourceMappingURL=seed.js.map