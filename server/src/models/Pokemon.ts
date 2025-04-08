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
PokemonSchema.set("toJSON", { virtuals: true });
PokemonSchema.set("toObject", { virtuals: true });

PokemonSchema.virtual("generation").get(function(){
  const id = parseInt(this.id);
  if (id >= 1 && id <= 151) return "Gen I";
  else if (id >= 152 && id <= 251) return "Gen II";
  else if (id >= 252 && id <= 386) return "Gen III";
  return "Unknown Generation";
});


// Create and export the model
const PokemonModel = model<IPokemon>('Pokemon', PokemonSchema);
export default PokemonModel;