import { Schema } from 'mongoose';

export interface CountingI {
    totalCounts?: number;
    highestCount?: number;
};

export const countingSchema = new Schema<CountingI>({
    totalCounts: { required: false, type: Number },
    highestCount: { required: false, type: Number }
}, { _id: false, versionKey: false });
