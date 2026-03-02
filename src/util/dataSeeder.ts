import bcrypt from "bcrypt";
import dotenvFlow from "dotenv-flow";
import { faker } from '@faker-js/faker';

// Project import
import { ProductModel } from "../models/productModel";
import { UserModel } from "../models/userModel";
import { connect, disconnect } from "../repository/database";

dotenvFlow.config();

/**
 * Seed the database with data
 */
export async function seed() {
  try {
    await connect();

    await deleteAllData();
    await seedData();
    console.log("Seeding process completed successfully...");
    process.exit();
  } catch (err) {
    console.log("Error Seeding data." + err);
  }
  finally {
    await disconnect();
  }
};

/**
 * Delete all data from the database
 */
export async function deleteAllData() {
  await ProductModel.deleteMany();
  await UserModel.deleteMany();

  console.log("Cleared data successfully...");
};

/**
 * Seed data into the database
 */
export async function seedData() {
  // hash the password
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash("12345678", salt);

  const user1 = new UserModel();
  user1.name = faker.person.fullName();
  user1.email = faker.internet.email();
  user1.password = passwordHash;
  await user1.save();

  const user2 = new UserModel();
  user2.name = faker.person.fullName();
  user2.email = faker.internet.email();
  user2.password = passwordHash;
  await user2.save();

  // Generate fake product
  for (let index = 0; index < 20; index++) {
    await new ProductModel(
      {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        imageUrl: "https://picsum.photos/500/500",
        price: faker.commerce.price({ min: 5, max: 5000 }),
        stock: faker.number.int({ min: 0, max: 200 }),
        isOnDiscount: faker.datatype.boolean(0.50),
        discountPct: faker.number.int({ min: 0, max: 100 }),
        isHidden: false,
        _createdBy: user1.id
      }
    ).save();
  }

  console.log("Seeded data successfully...");
};

// start the actual seeding
seed();