import { PanelPage } from '@/common/panel.js';
import { s } from '@fallencodes/seyfert-utils';
import { createContainer, createSeparator, createTextDisplay, createTextSection } from '@fallencodes/seyfert-utils/components/message';

export default ({
    title: 'Roleplay',
    description: (_client, guild) => `View ${guild.name}'s roleplay settings and whip lines.`,
    render: async (context, guild) => {
        const headerLines = [
            `### Roleplay Config • ${s(guild.name)}\n`,
            `Customize the roleplay system in your server. `,
            `Here you can view this server's roleplay whip lines.`
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
