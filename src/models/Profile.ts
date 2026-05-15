import { randomId } from '@fallencodes/seyfert-utils';
import { model, Schema } from 'mongoose';
import { CountingI, countingSchema } from './Profile/Counting.js';

export interface ProfileI {
    _id: string;
    userId: string;
    guildId: string;
    counting?: CountingI;
    rpEnabled?: boolean;
}

const profileSchema = new Schema<ProfileI>({
    _id: { required: false, type: String, default: () => randomId(16) },
    userId: { required: true, type: String },
    guildId: { required: true, type: String },
    rpEnabled: { required: false, type: Boolean },
    counting: { required: false, type: countingSchema }
}, { _id: false, versionKey: false, timestamps: true });

export default model('profiles', profileSchema);
