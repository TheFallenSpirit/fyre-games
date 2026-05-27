import { PanelPage } from '@/common/panel.js';
import { name } from '@fallencodes/seyfert-utils';
import { createContainer, createSeparator, createTextDisplay, createTextSection } from '@fallencodes/seyfert-utils/components/message';

export default ({
    title: 'Landing',
    emoji: () => '🏠',
    render: async (context, guild) => {
        let avatarUrl = context.client.me.avatarURL();
        const username = context.client.me.username;

        if (guild) {
            const me = await guild.members.fetch(context.client.me.id).catch(() => undefined);
            if (me) avatarUrl = me.avatarURL();
        };

        const commandCount = context.client.commandMentions.length;
        const supportInvite = context.globalMetadata.c.supportInvite;
        const componentCount = context.client.components.commands.length;

        const headerLines = [
            `### Help • ${username}\n`,
            `Welcome to ${username}, **${name(context.member ?? context.author, 'display-s')}** 👋\n`,
            `Use the select menu at the bottom to select a category and view it's commands.`
        ];

        const lines = [
            `${username} has ${commandCount} registered commands and ${componentCount} registered components.\n`,
            `To view ${username}'s ping, use ${context.client.getCmd('ping')}.\n\n`,
            `To report a bug, make a suggestion, or vote on upcoming features, join ${supportInvite}. `,
            'You can also view the latest and upcoming features there.\n\n',
            `Thank you for using ${username}!`
        ];

        const container = createContainer([
            createTextSection(headerLines.join(''), { type: 'thumbnail', url: avatarUrl }),
            createSeparator(1, false),
            createTextDisplay(lines.join(''))
        ], { color: context.globalMetadata.c.color });

        return ({ components: [container] })
    }
}) satisfies PanelPage<false>;
