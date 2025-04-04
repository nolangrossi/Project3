import { gql } from 'apollo-server';

const typeDefs = gql`
  type Pokemon {
    id: String!
    name: String!
    typing: [String!]!
  }

  type User {
  _id: ID!
  username: String!
  email: String!
  }

  type AuthPayload {
  token: String!
  user: User!
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

    getCurrentUser: User
  }

  type Mutation {
  registerUser(username: String!,
  email: String!,
  password: String!): AuthPayload
  
  loginUser(email: String!, password: String!): AuthPayload
  }
`;
export default typeDefs;