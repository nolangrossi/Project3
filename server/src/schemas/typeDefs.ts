import { gql } from 'apollo-server';

const typeDefs = gql`
  # Define the Pokemon type
  type Pokemon {
    id: Int!
    name: String!
    type: [String!]!
  }

  # Define the Query type
  type Query {
    # Fetch all Pokémon
    getAllPokemon: [Pokemon!]!

    # Fetch a single Pokémon by ID
    getPokemonById(id: Int!): Pokemon

    # Fetch Pokémon by type
    getPokemonByType(type: String!): [Pokemon!]!
  }
`;
export default typeDefs;