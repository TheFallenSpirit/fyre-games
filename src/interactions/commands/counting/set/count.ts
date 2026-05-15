import { updateGuild } from '@/store/guild.js';
import { s } from '@fallencodes/seyfert-utils';
import { CommandContext, createNumberOption, Declare, Group, Options, SubCommand } from 'seyfert';

const options = {
    'new-count': createNumberOption({
        required: true,
        min_value: 0,
        description: 'The new current count for this server.'
    })
};

@Declare({
    name: 'count',
    description: 'Set the current count in this server.',
    defaultMemberPermissions: ['ManageGuild']
})

@Group('set')
@Options(options)

export default class extends SubCommand {
    run = async (context: CommandContext<typeof options, 'guildConfig'>) => {
        const guild = await context.guild();
        if (!guild) return context.replyWith(context, 'guildUnavailable');

        await context.deferReply();
        const newCount = context.options['new-count'];

        await updateGuild(guild.id, {
            $set: { 'counting.currentNumber': newCount },
            $unset: { 'counting.lastCounterId': '' }
        });

        await context.editOrReply({
            content: `Successfully set ${s(guild.name)}'s current count to ${newCount}.`
        });
    };
};
