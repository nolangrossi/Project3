import { Schema , model, type Document } from 'mongoose';
import { hash, compare } from 'bcryptjs';
import type { IScore } from './scores';

export interface IUser extends Document {
    username: string;
    password: string;
    email: string;
    scores: IScore[];
    isCorrectPassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: [/.+@.+\..+/, 'Must use a valid email address'],
        },
        scores: {
            type: [Schema.Types.ObjectId],
            ref: 'Score',
            default: [],
        }
    },
    {
        toJSON: {
            virtuals: true,
        },
    }
);

UserSchema.pre<IUser>('save', async function(next) {
    console.log("Password Hashing Triggered")
    if (this.isNew ||this.isModified('password')) {
        const saltRounds = 10;
        this.password = await hash(this.password, saltRounds);
        console.log("Password Hashed:", this.password)
    }
    next();
});

UserSchema.methods.isCorrectPassword = async function(password: string) {
    return compare(password, this.password);
};

UserSchema.virtual('scoreCount').get(function() {
    return this.scores.length;
});

const User = model<IUser>('User', UserSchema);

export default User;    