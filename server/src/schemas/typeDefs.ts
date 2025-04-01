import { gql } from 'apollo-server';

const typeDefs = gql`
  type Pokemon {
    id: String!
    name: String!
    typing: [String!]!
  }

  type Query {
    # Fetch all Pokémon
    getAllPokemon: [Pokemon!]!

    # Fetch a single Pokémon by ID
    getPokemonById(id: String!): Pokemon

    # Fetch Pokémon by name
    getPokemonByName(name: String!): Pokemon

    # Fetch Pokémon by typing
    getPokemonByTyping(typing: String!): [Pokemon!]!
    
    getRandomPokemon: Pokemon
  }
`;
export default typeDefs;