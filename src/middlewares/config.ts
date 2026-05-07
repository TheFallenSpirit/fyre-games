import { GuildI } from '@/models/Guild.js';
import { getGuild } from '@/store/guild.js';
import { colors, isInstalled } from '@fallencodes/seyfert-utils';
import { createMiddleware } from 'seyfert';

export const defaultConfig = {
    color: colors.green,
    prefix: '-',
    username: 'Fyre Games'
};

export default createMiddleware<typeof defaultConfig>(async ({ next, context }) => {
    let guildConfig: GuildI | undefined;
    if (isInstalled(context)) guildConfig = await getGuild(context.guildId!);
    
    next({
        color: guildConfig?.defaultColor ?? defaultConfig.color,
        prefix: guildConfig?.prefix ?? defaultConfig.prefix,
        username: context.client.me.username
    });
});
