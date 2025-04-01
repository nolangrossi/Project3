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

    # Fetch Pokémon by type
    getPokemonByType(type: String!): [Pokemon!]!
    
    getRandomPokemon: Pokemon
  }
`;
export default typeDefs;