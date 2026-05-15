import { PanelPage } from '@/common/panel.js';
import { s } from '@fallencodes/seyfert-utils';
import { createActionRow, createButton, createContainer, createSeparator, createTextDisplay, createTextSection } from '@fallencodes/seyfert-utils/components/message';
import { Button } from 'seyfert';
import { ButtonStyle } from 'seyfert/lib/types/index.js';

export default ({
    title: 'Fast Friends',
    render: async (context, guild) => {
        const fastFriendsConfig = context.metadata.guildConfig.fastFriends;

        const headerLines = [
            `### Fast Friends Config • ${s(guild.name)}\n`,
            `On this page you can configure ${context.client.me.username}'s fast friends module in your server.`
        ];

        const lines = [
            `**Pair Channel Name Format**: `,
            `\`${fastFriendsConfig?.defaultPairChannelNameFormat ?? 'Fast Friends Pair {number}'}\``
        ];

        const container = createContainer([
            createTextSection(
                headerLines.join(''),
                { type: 'thumbnail', url: guild.iconURL() ?? context.client.me.avatarURL() }
            ),
            createSeparator(1, false),
            createTextDisplay(lines.join('')),
            createSeparator(1, false),
            createActionRow<Button>(createButton({
                label: 'Update Format',
                style: ButtonStyle.Primary,
                customId: `config.fast-friends.pair-channel-name-format:${context.author.id}`
            }))
        ], { color: context.globalMetadata.c.color });

        return ({ components: [container] });
    }
}) satisfies PanelPage<true>;
