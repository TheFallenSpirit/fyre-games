import { defaultConfig } from '@/middlewares/config.js';
import { updateGuild } from '@/store/guild.js';
import { s, trueOrFalse } from '@fallencodes/seyfert-utils';
import { emojisOptionValue } from '@fallencodes/seyfert-utils/options';
import { CommandContext, createStringOption, Declare, Group, Options, SubCommand } from 'seyfert';

const options = {
    'correct-emoji': createStringOption({
        value: emojisOptionValue,
        description: 'The emoji to react with if the number is correct.'
    }),
    'incorrect-emoji': createStringOption({
        value: emojisOptionValue,
        description: 'The emoji to react with if the number is incorrect.'
    }),
    reset: createStringOption({
        choices: trueOrFalse,
        description: 'If the emojis should be reset to the defaults.'
    })
};

@Declare({
    name: 'emojis',
    description: `Change the counting emojis ${defaultConfig.username} will react with.`,
    defaultMemberPermissions: ['ManageGuildExpressions']
})

@Group('set')
@Options(options)

export default class extends SubCommand {
    run = async (context: CommandContext<typeof options, 'guildConfig'>) => {
        const guild = await context.guild();
        if (!guild) return context.replyWith(context, 'guildUnavailable');

        if (context.options.reset === 'true') {
            await updateGuild(guild.id, { $unset: { 'counting.customEmojis': {} } });
            return context.editOrReply({ content: `Successfully reset ${s(guild.name)}'s counting emojis.` });
        };

        const query = {};
        await context.deferReply();

        const correctEmoji = context.options['correct-emoji']?.[0];
        if (correctEmoji) Object.assign(query, { 'counting.customEmojis.correct': correctEmoji });

        const incorrectEmoji = context.options['incorrect-emoji']?.[0];
        if (incorrectEmoji) Object.assign(query, { 'counting.customEmojis.incorrect': incorrectEmoji });

        await updateGuild(guild.id, { $set: query });
        await context.editOrReply({ content: `Successfully updated ${s(guild.name)}'s counting emojis.` });
    };
};
