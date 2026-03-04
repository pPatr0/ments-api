import bcrypt from "bcrypt";
import dotenvFlow from "dotenv-flow";

// Project imports
import { ProductModel } from "../models/productModel";
import { UserModel } from "../models/userModel";
import { connect, disconnect } from "../repository/database";

dotenvFlow.config();

// Real gym products with descriptions
const gymProducts = [
    {
        name: "Whey Protein Gold Standard",
        description: "Classic whey protein concentrate with 24g of protein per serving. Ideal for post-workout recovery and muscle building. Mixes easily with water or milk.",
        imageUrl: "https://picsum.photos/seed/whey/500/500",
        price: 599,
        stock: 85,
        category: "Protein",
        brand: "Optimum Nutrition",
        weightKg: 2.27,
        flavor: "Double Rich Chocolate",
        servings: 74,
        isOnDiscount: false,
        discountPercentage: 0,
        isHidden: false,
    },
    {
        name: "Casein Protein Slow Release",
        description: "Micellar casein protein that digests slowly over 6-8 hours. Perfect as a nighttime protein to prevent muscle breakdown during sleep.",
        imageUrl: "https://picsum.photos/seed/casein/500/500",
        price: 649,
        stock: 40,
        category: "Protein",
        brand: "MyProtein",
        weightKg: 2.5,
        flavor: "Strawberry Cream",
        servings: 83,
        isOnDiscount: true,
        discountPercentage: 15,
        isHidden: false,
    },
    {
        name: "Creatine Monohydrate 500g",
        description: "Pure micronised creatine monohydrate. Clinically proven to increase strength, power output, and lean muscle mass. Unflavoured for easy mixing.",
        imageUrl: "https://picsum.photos/seed/creatine/500/500",
        price: 299,
        stock: 120,
        category: "Supplement",
        brand: "BulkPowders",
        weightKg: 0.5,
        servings: 100,
        isOnDiscount: false,
        discountPercentage: 0,
        isHidden: false,
    },
    {
        name: "Pre-Workout Explosion",
        description: "High-stimulant pre-workout formula with caffeine, beta-alanine, and citrulline malate. Boosts energy, focus, and endurance for intense training sessions.",
        imageUrl: "https://picsum.photos/seed/preworkout/500/500",
        price: 449,
        stock: 55,
        category: "Supplement",
        brand: "C4",
        weightKg: 0.3,
        flavor: "Watermelon",
        servings: 30,
        isOnDiscount: true,
        discountPercentage: 20,
        isHidden: false,
    },
    {
        name: "BCAA 2:1:1 Amino Acids",
        description: "Branched-chain amino acids in the optimal 2:1:1 ratio. Reduces muscle soreness, prevents catabolism, and supports recovery during and after training.",
        imageUrl: "https://picsum.photos/seed/bcaa/500/500",
        price: 379,
        stock: 70,
        category: "Supplement",
        brand: "Scitec Nutrition",
        weightKg: 0.4,
        flavor: "Tropical Punch",
        servings: 40,
        isOnDiscount: false,
        discountPercentage: 0,
        isHidden: false,
    },
    {
        name: "Adjustable Dumbbell Set 2-24kg",
        description: "Space-saving adjustable dumbbells with quick-dial weight selection from 2kg to 24kg. Replaces 15 sets of traditional dumbbells. Ideal for home gym setups.",
        imageUrl: "https://picsum.photos/seed/dumbbells/500/500",
        price: 3999,
        stock: 10,
        category: "Equipment",
        brand: "Bowflex",
        weightKg: 24,
        isOnDiscount: false,
        discountPercentage: 0,
        isHidden: false,
    },
    {
        name: "Resistance Bands Set (5 levels)",
        description: "Set of 5 colour-coded resistance bands from 5kg to 50kg resistance. Great for warm-up, mobility work, assisted pull-ups, and full-body training.",
        imageUrl: "https://picsum.photos/seed/bands/500/500",
        price: 349,
        stock: 200,
        category: "Equipment",
        brand: "GymBeam",
        weightKg: 0.6,
        isOnDiscount: true,
        discountPercentage: 10,
        isHidden: false,
    },
    {
        name: "Pull-Up Bar Doorframe",
        description: "No-screw doorframe pull-up bar supporting up to 150kg. Multi-grip positions for wide, narrow, and neutral grip pull-ups. Easy to install and remove.",
        imageUrl: "https://picsum.photos/seed/pullupbar/500/500",
        price: 599,
        stock: 35,
        category: "Equipment",
        brand: "Iron Gym",
        weightKg: 2.1,
        isOnDiscount: false,
        discountPercentage: 0,
        isHidden: false,
    },
    {
        name: "Gym Gloves Pro Grip",
        description: "Half-finger training gloves with wrist support and anti-slip silicone grip. Protects palms from calluses and improves grip strength during heavy lifts.",
        imageUrl: "https://picsum.photos/seed/gloves/500/500",
        price: 249,
        stock: 90,
        category: "Apparel",
        brand: "Harbinger",
        weightKg: 0.15,
        isOnDiscount: false,
        discountPercentage: 0,
        isHidden: false,
    },
    {
        name: "Compression Shorts Men",
        description: "4-way stretch compression shorts with moisture-wicking fabric. Reduces muscle vibration and fatigue during high-intensity workouts. Available in S-XXL.",
        imageUrl: "https://picsum.photos/seed/shorts/500/500",
        price: 499,
        stock: 60,
        category: "Apparel",
        brand: "Under Armour",
        weightKg: 0.2,
        isOnDiscount: true,
        discountPercentage: 25,
        isHidden: false,
    },
    {
        name: "Vegan Protein Blend",
        description: "Plant-based protein blend combining pea, rice, and hemp protein for a complete amino acid profile. 22g protein per serving, lactose-free and soy-free.",
        imageUrl: "https://picsum.photos/seed/veganprotein/500/500",
        price: 679,
        stock: 30,
        category: "Protein",
        brand: "Vivo Life",
        weightKg: 1.0,
        flavor: "Vanilla",
        servings: 30,
        isOnDiscount: false,
        discountPercentage: 0,
        isHidden: false,
    },
    {
        name: "Foam Roller High Density",
        description: "High-density foam roller for deep tissue massage and myofascial release. Helps relieve muscle tightness, soreness, and improve flexibility post-workout.",
        imageUrl: "https://picsum.photos/seed/foamroller/500/500",
        price: 299,
        stock: 75,
        category: "Equipment",
        brand: "TriggerPoint",
        weightKg: 0.9,
        isOnDiscount: false,
        discountPercentage: 0,
        isHidden: false,
    },
];

/**
 * Seed the database with gym shop data
 */
export async function seed() {
    try {
        await connect();
        await deleteAllData();
        await seedData();
        console.log("Seeding process completed successfully...");
        process.exit();
    } catch (err) {
        console.log("Error seeding data: " + err);
    } finally {
        await disconnect();
    }
}

/**
 * Delete all existing data from the database
 */
export async function deleteAllData() {
    await ProductModel.deleteMany();
    await UserModel.deleteMany();
    console.log("Cleared existing data...");
}

/**
 * Seed users and gym products into the database
 */
export async function seedData() {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash("12345678", salt);

    // Create admin user
    const admin = new UserModel({
        name: "Admin User",
        email: "admin@gymshop.com",
        password: passwordHash,
    });
    await admin.save();

    // Create a regular test user
    const testUser = new UserModel({
        name: "Test User",
        email: "test@gymshop.com",
        password: passwordHash,
    });
    await testUser.save();

    // Insert all gym products created by admin
    for (const product of gymProducts) {
        await new ProductModel({
            ...product,
            _createdBy: admin.id,
        }).save();
    }

    console.log(`Seeded ${gymProducts.length} gym products and 2 users successfully.`);
    console.log("Login credentials: admin@gymshop.com / 12345678");
}

// Run the seeder
seed();