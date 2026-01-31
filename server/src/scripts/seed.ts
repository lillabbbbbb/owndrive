import { faker } from '@faker-js/faker';
import mongoose from "mongoose";
import { connectDB } from '../app';
import { User } from "../models/User";
import { File } from "../models/File";
import { Image } from "../models/Image";

const USER_COUNT = 5;
const IMAGE_COUNT = 5;
const FILE_COUNT = 10;

async function seed() {
  await connectDB();

  // 1️⃣ Clear collections
  await User.deleteMany({});
  await File.deleteMany({});
  await Image.deleteMany({});

  // 2️⃣ Create images
  const images = await Image.insertMany(
    Array.from({ length: IMAGE_COUNT }).map(() => ({
      filename: faker.system.fileName(),
      description: faker.lorem.sentence(),
      path: faker.system.filePath(),
      createdAt: faker.date.recent(),
    }))
  );

  // 3️⃣ Create users
  const users: any[] = await User.insertMany(
    Array.from({ length: USER_COUNT }).map(() => ({
      username: faker.internet.username(),
      email: faker.internet.email().toLowerCase(),
      password_hash: 'hashed_password',
      files: [], // will push files later
      language: faker.helpers.arrayElement(['en', 'es', 'fr']),
      mode: faker.helpers.arrayElement(['light', 'dark']),
      profile_pic: faker.helpers.arrayElement(images)._id,
    }))
  );

  // 4️⃣ Create files and link to users
  for (let i = 0; i < FILE_COUNT; i++) {
    const creator = faker.helpers.arrayElement(users);

    const file = await File.create({
      created_at: faker.date.past(),
      created_by: creator._id,
      last_edited_at: faker.date.recent(),
      file_type: faker.helpers.arrayElement(['doc', 'txt', 'md']),
      filename: faker.system.fileName(),
      content: faker.lorem.paragraphs(2),
      canView: users.map(u => u._id), // everyone can view
      canEdit: [creator._id], // only creator can edit
      visibleToGuests: faker.datatype.boolean(),
      showsInHomeShared: faker.datatype.boolean(),
      private: faker.datatype.boolean(),
      status: faker.helpers.arrayElement(['active', 'archived']),
      archivedAt: faker.datatype.boolean() ? faker.date.past() : undefined,
      inUse: false,
      usedBy: undefined,
    });

    // Push file to creator's files array
    creator.files.push(file._id);
    await creator.save();
  }

  console.log('✅ Seed finished');
  mongoose.connection.close();
}

seed().catch(err => {
  console.error(err);
  mongoose.connection.close();
});
