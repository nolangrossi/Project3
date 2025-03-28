import { Schema , model, type Document } from 'mongoose';

// Define the Pokémon schema
export interface IPokemon extends Document {
  id: number;
  name: string;
  typing: string[];
}

const PokemonSchema = new Schema<IPokemon>({
  id: {
    type: Number,
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