import { GuildI } from '@/models/Guild.js';
import { createGuild, getGuild } from '@/store/guild.js';
import { isInstalled } from '@fallencodes/seyfert-utils';
import { createMiddleware } from 'seyfert';

export default createMiddleware<GuildI>(async ({ next, context }) => {
    if (!isInstalled(context)) throw new Error('guildConfig middleware called from non guild command');

    let guild = await getGuild(context.guildId!);
    if (!guild) guild = await createGuild(context.guildId!);

    next(guild);
});
