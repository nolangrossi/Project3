import { Schema , model, type Document } from 'mongoose';

// Define the Pokémon schema
export interface IPokemon extends Document {
  id: string;
  name: string;
  typing: string[];
}

const PokemonSchema = new Schema<IPokemon>({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  typing: {
    type: [String],
    required: true,
  },
});

// Create and export the model
const PokemonModel = model<IPokemon>('Pokemon', PokemonSchema);
export default PokemonModel;