import mongoose from "mongoose";
import { PokemonModel } from "../models/index.js"; // Ensure this path matches your project structure
import pokedex from "./pokedex.json" with { type: "json" }; // Import the JSON file

// MongoDB connection URI
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/PokemonGame";

// Seed function
const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB.");

    // Clear existing Pokémon data
    await PokemonModel.deleteMany({});
    console.log("Cleared existing Pokémon data.");

    // Insert Pokémon data from JSON
    await PokemonModel.insertMany(pokedex);
    console.log("Seeded Pokémon data successfully.");

    // Close the database connection
    mongoose.connection.close();
    console.log("Database connection closed.");
  } catch (error) {
    console.error("Error seeding database:", error);
    mongoose.connection.close();
  }
};

// Run the seed function
seedDatabase();