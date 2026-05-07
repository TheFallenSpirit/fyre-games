import { PanelPage } from '@/common/panel.js';
import { s } from '@fallencodes/seyfert-utils';
import { createActionRow, createButton, createContainer, createMediaGallery, createSeparator, createTextDisplay, createTextSection } from '@fallencodes/seyfert-utils/components/message';
import { Button, ContainerBuilderComponents } from 'seyfert';
import { ButtonStyle } from 'seyfert/lib/types/index.js';

export default {
    title: 'Branding',
    description: (client, guild) => `Customize how ${client.me.username} appears in ${guild.name}.`,
    render: async (context, guild) => {
        const me = await guild.members.fetch(context.client.me.id);

        const headerLines = [
            `### Branding Config • ${s(guild.name)}\n`,
            `Customize how ${context.client.me.username} appears in ${s(guild.name)}.\n`,
            `Use the button below to update ${context.client.me.username}'s branding in this server.`
        ];

        const lines = [
            `**Display Name**: ${me.nick ?? context.client.me.username}\n`,
            `**Bio**: Open ${me}'s profile to view it's bio.`
        ];
        
        const components: ContainerBuilderComponents[] = [
            createTextSection(headerLines.join(''), { type: 'thumbnail', url: me.avatarURL() }),
            createSeparator(1, false),
            createTextDisplay(lines.join('')),
            createSeparator(1, false),
            createActionRow<Button>(createButton({
                label: 'Update Branding',
                style: ButtonStyle.Primary,
                customId: `config.branding.update:${context.author.id}`
            }))
        ];

        const bannerUrl = me.bannerURL();
        if (bannerUrl) components.push(createMediaGallery({ url: bannerUrl }));

        return ({ components: [createContainer(components, { color: context.globalMetadata.c.color })] });
    }
} satisfies PanelPage<true>;
