import {gql } from '@apollo/client';

export const GETRANDOMPOKEMON = gql`
    query Query {
        getRandomPokemon {
            id
            name
            typing
            generation
        }
    }
`;

export const GETALLPOKEMON = gql`
    query Query {
        getAllPokemon {
            id
            name
            typing
            generation
        }
    }
`;
export const GET_USER_STATS = gql`
  query getUserStats {
    getUserStats {
      user {
        _id
        username
      }
      scores_last_7_days
      scores_last_30_days
    }
  }
`;
export const GET_LEADERBOARD = gql`
  query GetLeaderboard($period: String!) {
    getLeaderboard(period: $period) {
      user {
        _id
        username
      }
      averageScore
    }
  }
`;
