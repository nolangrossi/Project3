import { PokemonModel, UserModel } from '../models/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

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
        const pokemons = await PokemonModel.find(); // Fetch all Pokémon from the database
        console.log('Fetched Pokémon:', pokemons);
        return pokemons;
      } catch (error) {
        console.error('Error fetching all Pokémon:', error);
        throw new Error('Failed to fetch Pokémon');
      }
    },

    // Fetch a single Pokémon by ID
    getPokemonById: async (_: any, { id }: { id: number }) => {
      try {
        const pokemon = await PokemonModel.findOne({ id }); // Find Pokémon by ID
        console.log(`Fetched Pokémon with ID ${id}:`, pokemon);
        return pokemon;
      } catch (error) {
        console.error(`Error fetching Pokémon with ID ${id}:`, error);
        throw new Error('Failed to fetch Pokémon');
      }
    },

    // Fetch Pokémon by type
    getPokemonByType: async (_: any, { type }: { type: string }) => {
      try {
        const pokemons = await PokemonModel.find({ typing: type }); // Find Pokémon by type
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
      const user = await UserModel.findById(context.user._id).select('-password')
      return user;
    } catch (error) {
      console.error('Error finding user:', error);
      throw new Error('Failed to find user');
    }
  },
  },

  Mutation: {
    registerUser: async (_: any, { username, email, password }: 
      {username: string; email: string; password: string }) => {
        try {
          const existingUser = await UserModel.findOne({ email });
          if (existingUser) {
            throw new Error('Email already in use');
          }
          const hashedPassword = await bcrypt.hash(password, 10);
          const newUser = new UserModel({ username, email, password: hashedPassword});
          await newUser.save();

          const token = jwt.sign({ _id: newUser._id, username: newUser.username,
             email: newUser.email }, process.env.JWT_SECRET_KEY || '', 
             { expiresIn: '1h' });

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
      try {
        // Fetch user by email
        const user = await UserModel.findOne({ email });
        
        // If no user found, throw error
        if (!user) {
          console.log(`User not found for email: ${email}`);
          throw new Error('Invalid login');
        }
        
        console.log(`Found user: ${user.username}`);
    
        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          console.log(`Password mismatch for user: ${user.username}`);
          throw new Error('Invalid login');
        }
    
        // Generate JWT token
        const token = jwt.sign(
          { _id: user._id, username: user.username, email: user.email },
          process.env.JWT_SECRET_KEY || '',
          { expiresIn: '1h' }
        );
    
        console.log('User logged in successfully');
        return { token, user };
      } catch (error) {
        console.error('Error logging in:', error);
        throw new Error('Failed to login');
      }
    },
 }
};

export default resolvers;