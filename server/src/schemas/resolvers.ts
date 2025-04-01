import { PokemonModel, UserModel } from '../models/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.js';
import { signToken } from '../services/auth.js';

dotenv.config();

interface Context {
  user?: {
    _id: string;
    username: string;
    email: string;
  };
}

const resolvers = {
  Query: {
    // Fetch all Pokémon
    getAllPokemon: async () => {
      try {
        const pokemons = await PokemonModel.find();
        console.log('Fetched Pokémon:', pokemons);
        return pokemons;
      } catch (error) {
        console.error('Error fetching all Pokémon:', error);
        throw new Error('Failed to fetch Pokémon');
      }
    },

    getPokemonById: async (_: any, { id }: { id: number }) => {
      try {
        const pokemon = await PokemonModel.findOne({ id });
        console.log(`Fetched Pokémon with ID ${id}:`, pokemon);
        return pokemon;
      } catch (error) {
        console.error(`Error fetching Pokémon with ID ${id}:`, error);
        throw new Error('Failed to fetch Pokémon');
      }
    },

    getPokemonByType: async (_: any, { type }: { type: string }) => {
      try {
        const pokemons = await PokemonModel.find({ typing: type });
        console.log(`Fetched Pokémon with type ${type}:`, pokemons);
        return pokemons;
      } catch (error) {
        console.error(`Error fetching Pokémon with type ${type}:`, error);
        throw new Error('Failed to fetch Pokémon');
      }
    },

    getRandomPokemon: async () => {
      try {
        const count = await PokemonModel.countDocuments();
        const random = Math.floor(Math.random() * count);
        const randomPokemon = await PokemonModel.findOne().skip(random);
        console.log('Fetched random Pokémon:', randomPokemon);
        return randomPokemon;
      } catch (error) {
        console.error('Error fetching random Pokémon:', error);
        throw new Error('Failed to fetch random Pokémon');
      }
    },

    getCurrentUser: async (_: any, __: any, context: Context) => {
      if (!context.user) {
        throw new Error('Unauthorized');
      }
      try {
        const user = await UserModel.findById(context.user._id).select('-password');
        return user;
      } catch (error) {
        console.error('Error finding user:', error);
        throw new Error('Failed to find user');
      }
    },
  },

  Mutation: {
    registerUser: async (_: any, { username, email, password }: 
      { username: string; email: string; password: string }) => {
        try {
          const existingUser = await UserModel.findOne({ email });
          if (existingUser) {
            throw new Error('Email already in use');
          }
          const newUser = new UserModel({ username, email, password });
          await newUser.save();

          const token = jwt.sign(
            { _id: newUser._id, username: newUser.username, email: newUser.email }, 
            process.env.JWT_SECRET || '', 
            { expiresIn: '1h' }
          );

          return { token, user: newUser };
        } catch (error: unknown) {
          if (error instanceof Error) {
            console.error('Error registering user:', {
              message: error.message,
              stack: error.stack
            });
            throw new Error(`Failed to register user: ${error.message}`);
          } else {
            console.error('Unexpected error registering user:', error);
            throw new Error('Failed to register user due to an unknown error');
          }
        }
    },

    loginUser: async (_: any, { email, password }: { email: string; password: string }) => {
      console.log("Attempting login for email:", email);
    
      const user = await User.findOne({ email });
      if (!user) {
        console.log("User not found for email:", email);
        throw new Error("User not found");
      }
    
      console.log("Found user:", user.username);
    
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        console.log("Password mismatch for user:", user.username);
        throw new Error("Invalid password");
      }
    
      const token = signToken(user.email, user.username, user._id.toString());
      console.log("Login successful for:", user.username);
      
      return { token, user };
    },
  }
};

export default resolvers;
