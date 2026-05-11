import { getConfig } from '@/middlewares/config.js';
import { updateGuild } from '@/store/guild.js';
import { s } from '@fallencodes/seyfert-utils';
import { Middlewares, ModalCommand, ModalContext } from 'seyfert';
import configPanel from '@/panels/config/config.js';

@Middlewares(['userLock', 'guildConfig'])
export default class extends ModalCommand {
    customId = 'config.fast-friends.pair-channel-name-format';

    run = async (context: ModalContext<'guildConfig'>) => {
        const guild = await context.guild();
        if (!guild) return context.replyWith(context, 'guildUnavailable');

        await context.deferReply(true);
        const format = context.interaction.getInputValue('format') as string;

        context.metadata.guildConfig = await updateGuild(
            guild.id,
            { $set: { 'fastFriends.defaultPairChannelNameFormat': format } }
        );

        context.globalMetadata.c = getConfig(
            context,
            context.metadata.guildConfig
        );

        await context.client.messages.edit(
            context.customId.split(':').at(1)!,
            context.channelId!,
            { ...(await configPanel(context, 'fastFriends')) }
        );
        
        await context.editOrReply({
            content: `Successfully updated ${s(guild.name)}'s fast friends settings.`
        });
    };
};
