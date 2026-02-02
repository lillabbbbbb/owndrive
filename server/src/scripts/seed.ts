import { faker } from '@faker-js/faker';
import mongoose from "mongoose";
import { connectDB } from '../app';
import { User } from "../models/User";
import { File } from "../models/File";
import { Image } from "../models/Image";
import env from "dotenv"

const USER_COUNT = 1;
const IMAGE_COUNT = 1;
const FILE_COUNT = 10;

async function seed() {
  await connectDB();

  // 1️⃣ Clear collections
  await User.deleteMany({});
  await File.deleteMany({});
  await Image.deleteMany({});

  async function seedDefaultUsers() {
    const existing = await User.findOne({ email: "admin@example.com" });
    if (!existing) { await User.create({
            username: "admin",
            email: "admin@example.com",
            password_hash: "$2b$10$QW4pgakcv692XpiiCWj7O.gmpxQIy9F0Ryo36eUrFyYxn6gZy2Pe6",
        });
        console.log("Admin user seeded");
    }
    return existing
}

await seedDefaultUsers()
const admin = await User.findOne({ email: "admin@example.com" });


  // 2️⃣ Create images
  const images = await Image.insertMany(
    Array.from({ length: IMAGE_COUNT }).map(() => ({
      filename: faker.system.fileName(),
      description: faker.lorem.sentence(),
      path: faker.system.filePath(),
      createdAt: faker.date.recent(),
    }))
  );
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

  if(!admin) return
  console.log("Admin found")

  // 4️⃣ Create files and link to users
  for (let i = 0; i < FILE_COUNT; i++) {

    const file = await File.create({
      created_at: faker.date.past(),
      created_by: admin._id,
      last_edited_at: faker.date.recent(),
      file_type: faker.helpers.arrayElement(['doc', 'txt', 'md']),
      filename: faker.system.fileName(),
      content: faker.lorem.paragraphs(2),
      visibleToGuests: faker.datatype.boolean(),
      showsInHomeShared: faker.datatype.boolean(),
      private: faker.datatype.boolean(),
      status: faker.helpers.arrayElement(['active', 'archived']),
      archivedAt: faker.datatype.boolean() ? faker.date.past() : undefined,
      inUse: false,
      usedBy: undefined,
    });

    // Push file to creator's files array
    admin.files.push(file._id);
    await admin.save();
  }

  console.log(await File.find().lean().exec())

  console.log('✅ Seed finished');
  mongoose.connection.close();
}

seed().catch(err => {
  console.error(err);
  mongoose.connection.close();
});
