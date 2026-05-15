import { randomId } from '@fallencodes/seyfert-utils';
import { model, Schema } from 'mongoose';
import { FastFriendsI, fastFriendsSchema } from './Guild/FastFriends.js';
import { CountingI, countingSchema } from './Guild/Counting.js';

export interface GuildI {
    _id: string;
    prefix?: string;
    guildId: string;
    whipLines?: string[];
    defaultColor?: number;
    fastFriends?: FastFriendsI;
    counting?: CountingI;
}

const guildSchema = new Schema<GuildI>({
    _id: { required: true, type: String, default: () => randomId(16) },
    guildId: { required: true, type: String },
    prefix: { required: false, type: String },
    defaultColor: { required: false, type: Number },
    whipLines: { required: false, type: [String] },
    fastFriends: { required: false, type: fastFriendsSchema },
    counting: { required: false, type: countingSchema }
}, { _id: false, versionKey: false, timestamps: true });

export default model('guilds', guildSchema);
