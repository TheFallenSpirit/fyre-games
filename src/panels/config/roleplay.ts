import { PanelPage } from '@/common/panel.js';
import { s } from '@fallencodes/seyfert-utils';
import { createContainer, createSeparator, createTextDisplay, createTextSection } from '@fallencodes/seyfert-utils/components/message';

export default ({
    title: 'Roleplay',
    render: async (context, guild) => {
        const headerLines = [
            `### Roleplay Settings • ${s(guild.name)}\n`,
            `On this page you can view ${context.client.me.username}'s roleplay whip lines in your server.`
        ];

        const lines = [
            `**Whip Lines**\n`,
            context.metadata.guildConfig.whipLines?.map((line) => `- ${line}`).join('\n') || 'None'
        ];

        const container = createContainer([
            createTextSection(
                headerLines.join(''),
                { type: 'thumbnail', url: guild.iconURL() ?? context.client.me.avatarURL() }
            ),
            createSeparator(1, false),
            createTextDisplay(lines.join(''))
        ], { color: context.globalMetadata.c.color });

        return ({ components: [container] });
    }
}) satisfies PanelPage<true>;
