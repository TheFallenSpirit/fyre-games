import { getConfig } from '@/middlewares/config.js';
import { updateGuild } from '@/store/guild.js';
import { Middlewares, ModalCommand, ModalContext } from 'seyfert';
import configPanel from '@/panels/config/config.js';
import { s } from '@fallencodes/seyfert-utils';

@Middlewares(['userLock', 'guildConfig'])
export default class extends ModalCommand {
    customId = 'config.counting.update';

    run = async (context: ModalContext<'guildConfig'>) => {
        const guild = await context.guild();
        if (!guild) return context.replyWith(context, 'guildUnavailable');

        const query = {};
        await context.deferReply(true);

        const channel = context.interaction.getChannels('channel')?.[0];
        Object.assign(query, { 'counting.channelId': channel?.id });

        const failRole = context.interaction.getRoles('fail-role')?.[0];
        Object.assign(query, { 'counting.failRoleId': failRole?.id });

        const numbersOnly = (context.interaction.getInputValue('numbers-only') as string[])[0];
        Object.assign(query, { 'counting.numbersOnly': numbersOnly === 'true' });

        context.metadata.guildConfig = await updateGuild(guild.id, { $set: query }, true);
        context.globalMetadata.c = getConfig(context, context.metadata.guildConfig);

        await context.interaction.message?.edit({ ...(await configPanel(context, 'counting')) });
        await context.editOrReply({ content: `Successfully updated ${s(guild.name)}'s counting settings.` });
    };
};
