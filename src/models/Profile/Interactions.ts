import { Schema } from 'mongoose';

interface InteractionI {
    given?: number;
    received?: number;
}

export interface InteractionsI {
    whips?: InteractionI;
}

const interactionSchema = new Schema<InteractionI>({
    given: { required: false, type: Number },
    received: { required: false, type: Number }
}, { _id: false, versionKey: false });

export const interactionsSchema = new Schema<InteractionsI>({
    whips: { required: false, type: interactionSchema }
}, { _id: false, versionKey: false });
