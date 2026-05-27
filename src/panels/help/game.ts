import { PanelPage } from '@/common/panel.js';
import { displayCommand, getCommandList } from './help.js';
import { createContainer, createSeparator, createTextDisplay, createTextSection } from '@fallencodes/seyfert-utils/components/message';

export default ({
    title: 'Game Commands',
    emoji: () => '🎲',
    render: async (context, guild) => {
        let avatarUrl = context.client.me.avatarURL();
        const username = context.client.me.username;
        const commands = getCommandList(context.client, 'games');

        if (guild) {
            const me = await guild.members.fetch(context.client.me.id).catch(() => undefined);
            if (me) avatarUrl = me.avatarURL();
        };

        const lines = [
            `### Game Commands • ${username}\n`,
            `A list of ${username}'s game commands. `,
            'These commands let users have fun participating in games with others.'
        ];

        const container = createContainer([
            createTextSection(lines.join(''), { type: 'thumbnail', url: avatarUrl }),
            createSeparator(1, false),
            createTextDisplay(commands.map((command) => displayCommand(context, command)).join(''))
        ], { color: context.globalMetadata.c.color });

        return ({ components: [container] });
    }
}) satisfies PanelPage<false>;
