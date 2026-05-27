import { GuildI } from '@/models/Guild.js';
import { getGuild } from '@/store/guild.js';
import { colors, isInstalled } from '@fallencodes/seyfert-utils';
import { AnyContext, createMiddleware } from 'seyfert';

export const defaultConfig = {
    color: colors.green,
    prefix: '-',
    username: 'Fyre Games',
    supportInvite: '[Fyre Hub](https://discord.gg/SNxqD4ujTF)'
};

export default createMiddleware<typeof defaultConfig>(async ({ next, context }) => {
    let guildConfig: GuildI | undefined;
    if (isInstalled(context)) guildConfig = await getGuild(context.guildId!);
    
    next({
        ...defaultConfig,
        color: guildConfig?.defaultColor ?? defaultConfig.color,
        prefix: guildConfig?.prefix ?? defaultConfig.prefix,
        username: context.client.me.username
    });
});

export function getConfig(context: AnyContext, guildConfig: GuildI): typeof defaultConfig {
    return ({
        ...defaultConfig,
        color: guildConfig.defaultColor ?? defaultConfig.color,
        prefix: guildConfig.prefix ?? defaultConfig.prefix,
        username: context.client.me.username
    });
};
