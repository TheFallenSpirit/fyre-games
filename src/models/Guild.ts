import { randomId } from '@fallencodes/seyfert-utils';
import { model, Schema } from 'mongoose';

export interface GuildI {
    _id: string;
    prefix?: string;
    guildId: string;
    whipLines?: string[];
    defaultColor?: number;
}

const guildSchema = new Schema<GuildI>({
    _id: { required: true, type: String, default: () => randomId(16) },
    guildId: { required: true, type: String },
    prefix: { required: false, type: String },
    defaultColor: { required: false, type: Number },
    whipLines: { required: false, type: [String] }
}, { _id: false, versionKey: false, timestamps: true });

export default model('guilds', guildSchema);
