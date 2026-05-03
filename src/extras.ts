import { Message } from 'seyfert';
import { defaultConfig } from './middlewares/config.js';
import { getGuild } from './store/guild.js';

export async function prefix(message: Message) {
    if (!message.guildId) return [defaultConfig.prefix];
    const guildConfig = await getGuild(message.guildId);
    return [guildConfig?.prefix ?? defaultConfig.prefix];
};
