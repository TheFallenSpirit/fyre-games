import { updateGuild } from '@/store/guild.js';
import { hexRegex, s } from '@fallencodes/seyfert-utils';
import { Middlewares, ModalCommand, ModalContext } from 'seyfert';
import configPanel from '@/panels/config/config.js';
import { getConfig } from '@/middlewares/config.js';

@Middlewares(['guildConfig'])
export default class extends ModalCommand {
    customId = 'config.home.settings';

    run = async (context: ModalContext<'guildConfig'>) => {
        const guild = await context.guild();
        if (!guild) return context.replyWith(context, 'guildUnavailable');

        await context.deferReply(true);
        const accentColor = context.interaction.getInputValue('accent-color') as string;
        if (!accentColor.match(hexRegex)) return context.replyWith(context, 'invalidHex', { hex: accentColor });
        const prefix = context.interaction.getInputValue('prefix') as string;

        context.metadata.guildConfig = await updateGuild(
            guild.id,
            { $set: { prefix, defaultColor: parseInt(accentColor.replace('#', '0x')) } }
        );

        const channel = await context.channel();
        if (!channel.isGuildTextable()) return context.replyWith(context, 'channelUnavailable');

        context.globalMetadata.c = getConfig(context, context.metadata.guildConfig);
        await channel.messages.edit(context.customId.split(':').at(1)!, { ...(await configPanel(context, 'home')) });

        await context.editOrReply({
            content: `Successfully updated ${context.client.me.username}'s general settings in ${s(guild.name)}.`
        });
    };
};
