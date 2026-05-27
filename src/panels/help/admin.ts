import { PanelPage } from '@/common/panel.js';
import { displayCommand, getCommandList } from './help.js';
import { createContainer, createSeparator, createTextDisplay, createTextSection } from '@fallencodes/seyfert-utils/components/message';

export default ({
    title: 'Admin Commands',
    emoji: () => '⚙️',
    render: async (context, guild) => {
        let avatarUrl = context.client.me.avatarURL();
        const username = context.client.me.username;
        const commands = getCommandList(context.client, 'admin');

        if (guild) {
            const me = await guild.members.fetch(context.client.me.id).catch(() => undefined);
            if (me) avatarUrl = me.avatarURL();
        };

        const lines = [
            `### Admin Commands • ${username}\n`,
            `A list of ${username}'s admin commands. `,
            `These commands let admins configure and customize ${username} in their servers.`
        ];

        const container = createContainer([
            createTextSection(lines.join(''), { type: 'thumbnail', url: avatarUrl }),
            createSeparator(1, false),
            createTextDisplay(commands.map((command) => displayCommand(context, command)).join(''))
        ], { color: context.globalMetadata.c.color });

        return ({ components: [container] });
    }
}) satisfies PanelPage<false>;
