import { PanelPage } from '@/common/panel.js';
import { s } from '@fallencodes/seyfert-utils';
import { createActionRow, createButton, createContainer, createSeparator, createTextDisplay, createTextSection } from '@fallencodes/seyfert-utils/components/message';
import { Button } from 'seyfert';
import { ButtonStyle } from 'seyfert/lib/types/index.js';

export default ({
    title: 'Counting',
    render: async (context, guild) => {
        const countingConfig = context.metadata.guildConfig.counting;
        
        const headerLines = [
            `### Counting Config • ${s(guild.name)}\n`,
            `On this page you can configure ${context.client.me.username}'s counting module in your server.\n\n`,
            'Numbers only mode prevents any messages from being sent in the channel without numbers, ',
            'and the fail role is given to members who mess up the count.'
        ];

        const lines = [
            `**Channel**: ${countingConfig?.channelId ? `<#${countingConfig.channelId}>` : 'None'}\n`,
            `**Fail Role**: ${countingConfig?.failRoleId ? `<@&${countingConfig.failRoleId}>` : 'None'}\n`,
            `**Numbers Only Mode**: ${(countingConfig?.numbersOnly ?? true) ? 'Enabled' : 'Disabled'}\n\n`,
            `**Custom Emojis**`
        ];

        if (countingConfig?.customEmojis?.correct) lines.push(
            `\n- Correct - ${countingConfig.customEmojis.correct}`
        );

        if (countingConfig?.customEmojis?.incorrect) lines.push(
            `\n- Incorrect - ${countingConfig.customEmojis.incorrect}`
        );

        if (!countingConfig?.customEmojis?.correct && !countingConfig?.customEmojis?.incorrect) lines.push(
            '\nNone'
        );

        const footerLines = [
            `To update ${s(guild.name)}'s counting emojis, or set the current count, use `,
            `\`/counting set count\` and \`/counting set emojis\`.`
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
                label: 'Update Settings',
                style: ButtonStyle.Primary,
                customId: `config.counting.update:${context.author.id}`
            })),
            createSeparator(1, false),
            createTextDisplay(footerLines.join(''))
        ], { color: context.globalMetadata.c.color });

        return ({ components: [container] });
    }
}) satisfies PanelPage<true>;
