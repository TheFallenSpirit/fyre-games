import customizeLogger from '@fallencodes/seyfert-utils/logger';
import { DisabledCache, LimitedMemoryAdapter } from 'seyfert';
import handleCommand from './common/handleCommand.js';
import middlewares, { globalMiddlewares } from './middlewares/middlewares.js';
import { ms } from 'itty-time';
import { connect } from 'mongoose';
import validateEnv from './common/validateEnv.js';
import { Redis } from 'ioredis';
import { context, prefix } from './extras.js';
import FyreClient from './client.js';

validateEnv();
customizeLogger();

const client = new FyreClient({
    context,
    commands: { reply: () => true, prefix },
    allowedMentions: { parse: ['users'], replied_user: false },
    globalMiddlewares: Object.keys(globalMiddlewares) as (keyof typeof globalMiddlewares)[]
});

export const redis = new Redis(process.env.REDIS_URL ?? '');
connect(process.env.MONGO_URL ?? '', { dbName: 'app' })
.then(() => client.logger.info('Successfully connected to MongoDB.'))
.catch(() => client.logger.fatal('Failed to connect to MongoDB!'));

const adapter = new LimitedMemoryAdapter({
    default: { expire: ms('1 hour') },
    role: { expire: 0 },
    guild: { expire: 0 },
    channel: { expire: 0 },
    overwrite: { expire: 0 },
    voice_state: { expire: ms('6 hours') }
});

const disabledCache: DisabledCache = {
    bans: true,
    emojis: true,
    stickers: true,
    presences: true,
    stageInstances: true
};

client.setServices({
    cache: { adapter, disabledCache },
    middlewares,
    handleCommand
});

client.start();
