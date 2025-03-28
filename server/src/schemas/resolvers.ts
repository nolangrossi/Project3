import { PokemonModel } from '../models/index.js';

const resolvers = {
  Query: {
    // Fetch all Pokémon
    getAllPokemon: async () => {
      try {
        return await PokemonModel.find(); // Fetch all Pokémon from the database
      } catch (error) {
        console.error('Error fetching all Pokémon:', error);
        throw new Error('Failed to fetch Pokémon');
      }
    },

    // Fetch a single Pokémon by ID
    getPokemonById: async (_: any, { id }: { id: number }) => {
      try {
        return await PokemonModel.findOne({ id }); // Find Pokémon by ID
      } catch (error) {
        console.error(`Error fetching Pokémon with ID ${id}:`, error);
        throw new Error('Failed to fetch Pokémon');
      }
    },

    // Fetch Pokémon by type
    getPokemonByType: async (_: any, { type }: { type: string }) => {
      try {
        return await PokemonModel.find({ typing: type }); // Find Pokémon by type
      } catch (error) {
        console.error(`Error fetching Pokémon with type ${type}:`, error);
        throw new Error('Failed to fetch Pokémon');
      }
    },
  },
};

export default resolvers;