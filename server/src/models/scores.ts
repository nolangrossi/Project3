import {Schema , model, type Document } from 'mongoose';

import type { IUser } from './user.js';
import type { IPokemon } from './Pokemon.js';
export interface IScore extends Document {
    userId: IUser;
    score: number;
    date: Date;
    pokemonId: IPokemon;
}

const ScoreSchema = new Schema<IScore>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        score: {
            type: Number,
            required: true,
        },
        date: {
            type: Date,
            default: Date.now,
        },
        pokemonId: {
            type: Schema.Types.ObjectId,
            ref: 'Pokemon',
            required: true,
        },
    },
    {
        toJSON: {
            virtuals: true,
        },
    }
);

const ScoreModel = model<IScore>('Score', ScoreSchema);
export default ScoreModel;