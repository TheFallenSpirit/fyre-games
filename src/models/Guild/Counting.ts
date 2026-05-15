import { Schema } from 'mongoose';

export interface CountingI {
    channelId?: string;
    failRoleId?: string;
    // failRoles?: string[];
    numbersOnly?: boolean;
    customEmojis?: CustomEmojisI;
    lastCounterId?: string;
    currentNumber?: number;
}

interface CustomEmojisI {
    correct?: string;
    incorrect?: string;
}

const customEmojisSchema = new Schema<CustomEmojisI>({
    correct: { required: false, type: String },
    incorrect: { required: false, type: String }
}, { _id: false, versionKey: false });

export const countingSchema = new Schema<CountingI>({
    channelId: { required: false, type: String },
    failRoleId: { required: false, type: String },
    numbersOnly: { required: false, type: Boolean },
    currentNumber: { required: false, type: Number },
    lastCounterId: { required: false, type: String },
    customEmojis: { required: false, type: customEmojisSchema }
    // failRoles: { required: false, type: [String] }
}, { _id: false, versionKey: false });
