import {gql } from '@apollo/client';

export const GETRANDOMPOKEMON = gql`
    query Query {
        getRandomPokemon {
            id
            name
            typing
        }
    }
`;