import { Schema } from 'mongoose';

export interface FastFriendsI {
    defaultPairChannelNameFormat?: string;
}

export const fastFriendsSchema = new Schema<FastFriendsI>({
    defaultPairChannelNameFormat: { required: false, type: String }
}, { _id: false, versionKey: false });
