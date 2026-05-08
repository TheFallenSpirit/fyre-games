import { updateProfile } from '@/store/profile.js';
import { s } from '@fallencodes/seyfert-utils';
import { CommandContext, Declare, SubCommand } from 'seyfert';
import { MessageFlags } from 'seyfert/lib/types/index.js';

@Declare({
    name: 'out',
    description: 'Opt-out of roleplay features in this server.'
})

export default class extends SubCommand {
    run = async (context: CommandContext<{}, 'profile'>) => {
        const guild = await context.guild();
        if (!guild) return context.replyWith(context, 'guildUnavailable');

        if (context.metadata.profile.rpEnabled !== true) return context.editOrReply({
            flags: MessageFlags.Ephemeral,
            content: `You're already opted-out of roleplay features in ${s(guild.name)} silly.`
        });

        await updateProfile(
            guild.id,
            context.author.id,
            { $set: { rpEnabled: false } }
        );

        await context.editOrReply({
            flags: MessageFlags.Ephemeral,
            content: `Successfully opted-out of roleplay features in ${s(guild.name)}.`
        });
    };
};
