import { PanelPage } from '@/common/panel.js';
import { numberToHex, s } from '@fallencodes/seyfert-utils';
import { createContainer, createTextDisplay, createSeparator, createTextSection, createActionRow, createButton } from '@fallencodes/seyfert-utils/components/message';
import { Button } from 'seyfert';
import { ButtonStyle } from 'seyfert/lib/types/index.js';

export default ({
    title: 'Home',
    render: async (context, guild) => {
        const me = await context.me();
        if (!me) return ({ content: context.client.lang('selfNotMember', { guild: guild.name }) });

        const headerLines = [
            `### General Settings • ${s(guild.name)}\n`,
            `On this page you can configure ${context.client.me.username}'s `,
            `general settings and branding in your server.`
        ];

        const settingsLines = [
            `**Prefix**: \`${context.globalMetadata.c.prefix}\`\n`,
            `**Accent Color**: \`#${numberToHex(context.globalMetadata.c.color)}\``
        ];

        const brandingLines = [
            `### Branding Settings • ${s(context.client.me.username)}\n`,
            `Here you can update ${context.client.me.username}'s nickname, bio, avatar, and banner in this server.`
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

        return ({ components: [container] });
    }
}) satisfies PanelPage<true>;
