import { redis } from '@/app.js';
import Guild, { GuildI } from '@/models/Guild.js';
import { replacer, reviver } from '@fallencodes/seyfert-utils';
import { seconds } from 'itty-time';
import { UpdateQuery } from 'mongoose';
import { transformUndefinedToUnset } from './index.js';

export async function getGuild(guildId: string): Promise<GuildI | undefined> {
    const cachedGuild = await redis.get(`fg_guild:${guildId}`);
    if (cachedGuild) return JSON.parse(cachedGuild, reviver) as GuildI;

    const dbGuild = await Guild.findOne({ guildId });
    if (!dbGuild) return;

    const guildObject = dbGuild.toObject();
    await cacheGuild(guildObject);
    return guildObject;
};

export async function updateGuild(guildId: string, query: UpdateQuery<GuildI>, transformQuery?: boolean): Promise<GuildI> {
    if (transformQuery === true) query = transformUndefinedToUnset<GuildI>(query);
    const guild = await Guild.findOneAndUpdate({ guildId }, query, { returnDocument: 'after' });
    if (!guild) throw new Error(`The specified guild wasn't found -- updateGuild ${guildId}`);
    const guildObject = guild.toObject();
    await cacheGuild(guildObject);
    return guildObject;
};

export async function cacheGuild(guild: GuildI) {
    await redis.set(`fg_guild:${guild.guildId}`, JSON.stringify(guild, replacer), 'EX', seconds('3 days'));
};
