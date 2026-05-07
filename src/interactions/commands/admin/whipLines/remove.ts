import { CommandContext, createNumberOption, Declare, Options, SubCommand } from 'seyfert';
import { linesAutocomplete } from './whipLines.js';
import { updateGuild } from '@/store/guild.js';
import { s } from '@fallencodes/seyfert-utils';

const options = {
    line: createNumberOption({
        required: true,
        description: 'The whip line to remove.',
        autocomplete: linesAutocomplete
    })
};

@Declare({
    name: 'remove',
    description: `Remove a whip line from this server's rp whip lines.`
})

@Options(options)

export default class extends SubCommand {
    run = async (context: CommandContext<typeof options, 'guildConfig'>) => {
        const guild = await context.guild();
        if (!guild) return context.replyWith(context, 'guildUnavailable');

        const index = context.options.line;
        const line = context.metadata.guildConfig.whipLines?.[index];
        
        if (!line) return context.editOrReply({
            content: `Hold up! The specified whip line wasn't found.`
        });

        await updateGuild(guild.id, { $pull: { whipLines: line } });
        await context.editOrReply({ content: `Successfully removed "${line}" from ${s(guild.name)}'s whip lines.` });
    };
};
