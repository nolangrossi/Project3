import { gql } from 'apollo-server';

const typeDefs = gql`
  type Pokemon {
    id: String!
    name: String!
    typing: [String!]!
    generation: String! # Add the virtual field here
  }

  type User {
    _id: ID!
    username: String!
    email: String!
  }

  type UserStats {
    user: User!
    scores_last_7_days: [Int!]!
    scores_last_30_days: [Int!]!
  }

  type MessageResponse {
    message: String
  }

  type AuthPayload {
    token: String!
    user: User!
  }
    type LeaderboardEntry {
  user: User!
  averageScore: Float!
}

extend type Query {
  getLeaderboard(period: String!): [LeaderboardEntry!]!
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

    getUserStats: UserStats
  }

  type Mutation {
    registerUser(
      username: String!
      email: String!
      password: String!
    ): AuthPayload

    loginUser(
      email: String!
      password: String!
    ): AuthPayload

    trackUserStats(
      score: Int!
    ): MessageResponse!
  }
`;

export default typeDefs;
