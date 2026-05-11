import { randomId } from '@fallencodes/seyfert-utils';
import { model, Schema } from 'mongoose';
import { FastFriendsI, fastFriendsSchema } from './Guild/FastFriends.js';

export interface GuildI {
    _id: string;
    prefix?: string;
    guildId: string;
    whipLines?: string[];
    defaultColor?: number;
    fastFriends?: FastFriendsI;
}

const guildSchema = new Schema<GuildI>({
    _id: { required: true, type: String, default: () => randomId(16) },
    guildId: { required: true, type: String },
    prefix: { required: false, type: String },
    defaultColor: { required: false, type: Number },
    whipLines: { required: false, type: [String] },
    fastFriends: { required: false, type: fastFriendsSchema }
}, { _id: false, versionKey: false, timestamps: true });

export default model('guilds', guildSchema);
