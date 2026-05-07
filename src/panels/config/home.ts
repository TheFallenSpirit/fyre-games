import { PanelPage } from '@/common/panel.js';
import { s } from '@fallencodes/seyfert-utils';
import { createContainer, createTextDisplay, createSeparator, createTextSection, createActionRow, createButton } from '@fallencodes/seyfert-utils/components/message';
import { Button } from 'seyfert';
import { ButtonStyle, MessageFlags } from 'seyfert/lib/types/index.js';

export default ({
    title: 'Home',
    description: (client, guild) => `The home page of your ${client.me.username} config in ${guild.name}.`,
    render: async (context, guild) => {
        const me = await context.me();
        if (!me) return ({ content: context.client.lang('selfNotMember', { guild: guild.name }) });

        const headerLines = [
            `### Server Config • ${s(guild.name)}\n`,
            `Welcome to your ${context.client.me.username} config for ${s(guild.name)}. `,
            `Here you can update this server's basic settings.`
        ];

        const settingsLines = [
            `**Prefix**: \`${context.globalMetadata.c.prefix}\`\n`,
            `**Accent Color**: \`#${context.globalMetadata.c.color.toString(16).padStart(6, '0')}\``
        ];

        const brandingLines = [
            `### Branding Config\n`,
            `Customize how ${context.client.me.username} appears in this server. `,
            `Here you can update ${context.client.me.username}'s nickname, bio, avatar, and banner here.`
        ];

        const container = createContainer([
            createTextSection(
                headerLines.join(''),
                { type: 'thumbnail', url: guild.iconURL() ?? context.client.me.avatarURL() }
            ),
            createSeparator(1, false),
            createTextDisplay(settingsLines.join('')),
            createSeparator(1, false),
            createActionRow<Button>(createButton({
                label: 'Update Settings',
                style: ButtonStyle.Primary,
                customId: `config.home.settings:${context.author.id}`
            })),
            createSeparator(),
            createTextSection(brandingLines.join(''), { type: 'thumbnail', url: me.avatarURL() }),
            createActionRow<Button>(createButton({
                label: 'Update Branding',
                style: ButtonStyle.Primary,
                customId: `config.home.branding:${context.author.id}`
            }))
        ], { color: context.globalMetadata.c.color });

        return ({
            flags: MessageFlags.IsComponentsV2,
            components: [container]
        });
    }
}) satisfies PanelPage<true>;
