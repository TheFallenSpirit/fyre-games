import { getGuild } from '@/store/guild.js';
import { colors, isInstalled } from '@fallencodes/seyfert-utils';
import { createMiddleware } from 'seyfert';

export const defaultConfig = {
    color: colors.green,
    prefix: '-'
};

export default createMiddleware<typeof defaultConfig>(async ({ next, context }) => {
    if (!isInstalled(context)) return next(defaultConfig);
    const guildConfig = await getGuild(context.guildId!);
    
    next({
        color: guildConfig?.defaultColor ?? defaultConfig.color,
        prefix: guildConfig?.prefix ?? defaultConfig.prefix
    });
});
