import { redis } from '@/app.js';
import { seconds } from 'itty-time';
import { CommandContext, Declare, SubCommand } from 'seyfert';

@Declare({
    name: 'start',
    description: 'Start a new fast friends game in this channel.',
    defaultMemberPermissions: ['ManageEvents']
})

export default class extends SubCommand {
    run = async (context: CommandContext) => {
        const channel = await context.channel();
        if (!channel.isVoice() && !channel.isStage()) return context.replyWith(context, 'voiceBasedChannelOnly');
        
        const lines = [
            `Successfully started a fast friends game in ${channel}.`,
            `Members can join the game using \`/fast-friends join\`.`
        ];

        await redis.set(`fg_ff_active:${channel.id}`, 'true', 'EX', seconds('1 hour'));
        await context.editOrReply({ content: lines.join(' ') });
    };
};
