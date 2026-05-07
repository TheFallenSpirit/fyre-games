import configPanel from '@/panels/config/config.js';
import { s } from '@fallencodes/seyfert-utils';
import { Attachment, Middlewares, ModalCommand, ModalContext } from 'seyfert';

@Middlewares(['guildConfig'])
export default class extends ModalCommand {
    customId = 'config.home.branding';

    run = async (context: ModalContext<'guildConfig'>) => {
        const guild = await context.guild();
        if (!guild) return context.replyWith(context, 'guildUnavailable');

        const me = await context.me();
        if (!me) return context.replyWith(context, 'selfNotMember', { guild: guild.name });

        await context.deferReply(true);
        const bio = context.interaction.getInputValue('bio') as string | undefined;
        const nick = context.interaction.getInputValue('nick') as string | undefined;

        const avatar = context.interaction.getFiles('avatar')?.[0];
        const banner = context.interaction.getFiles('banner')?.[0];
        const query: {} = { bio: bio || null, nick: nick || null };

        if (avatar) {
            const avatarData = await getBase64FromAttachment(avatar);
            if (avatarData) Object.assign(query, { avatar: avatarData });
        };

        if (banner) {
            const bannerData = await getBase64FromAttachment(banner);
            if (bannerData) Object.assign(query, { avatar: bannerData });
        };

        try {
            await context.client.proxy.guilds(guild.id).members('@me').patch({ body: query });
        } catch (_error) {
            return context.editOrReply({
                content: 'An unknown error was encountered when trying to update branding.'
            });
        };

        const channel = await context.channel();
        if (!channel.isGuildTextable()) return context.replyWith(context, 'channelUnavailable');

        await channel.messages.edit(
            context.customId.split(':').at(1)!,
            { ...(await configPanel(context, 'home')) }
        );

        await context.editOrReply({
            content: `Successfully updated ${context.client.me.username}'s branding in ${s(guild.name)}.`
        });
    };
};

async function getBase64FromAttachment(attachment: Attachment) {
    if (!attachment.contentType || !['image/jpeg', 'image/png'].includes(attachment.contentType)) return;

    const response = await fetch(attachment.url).catch(() => {});
    if (!response?.ok) return;

    const buffer = Buffer.from(await response.arrayBuffer());
    return `data:${attachment.contentType};base64,${buffer.toString('base64')}`;
};
