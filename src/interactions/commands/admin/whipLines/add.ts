import { updateGuild } from '@/store/guild.js';
import { s } from '@fallencodes/seyfert-utils';
import { CommandContext, createStringOption, Declare, Options, SubCommand } from 'seyfert';

const options = {
    line: createStringOption({
        required: true,
        description: 'The whip line to add.'
    })
};

@Declare({
    name: 'add',
    description: `Add a new whip line to this server's rp whip lines.`
})

@Options(options)

export default class extends SubCommand {
    run = async (context: CommandContext<typeof options, 'guildConfig'>) => {
        const guild = await context.guild();
        if (!guild) return context.replyWith(context, 'guildUnavailable');

        const whipLines = context.metadata.guildConfig.whipLines ?? [];
        if (whipLines.length >= 50) return context.editOrReply({
            content: `Hold up! ${s(guild.name)} has reached it's max of 50 whip lines.`
        });

        const line = context.options.line;
        await updateGuild(guild.id, { $addToSet: { whipLines: line } });
        await context.editOrReply({ content: `Successfully added "${line}" to ${s(guild.name)}'s whip lines.` });
    };
};
