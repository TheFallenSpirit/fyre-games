import { redis } from '@/app.js';
import { CommandContext, Declare, Middlewares, SubCommand } from 'seyfert';
import { MessageFlags } from 'seyfert/lib/types/index.js';

@Declare({
    name: 'leave',
    description: 'Leave the fast friends game in this channel.'
})

@Middlewares(['fastFriendsGame'])
export default class extends SubCommand {
    run = async (context: CommandContext) => {
        const channel = await context.channel();

        const isMember = await redis.sismember(
            `fg_ff_members:${channel.id}`,
            context.author.id
        ) === 1;

        if (!isMember) return context.editOrReply({
            flags: MessageFlags.Ephemeral,
            content: `Hold up! You're not in this game silly.`
        });

        await redis.srem(
            `fg_ff_members:${channel.id}`,
            context.author.id
        );

        await context.editOrReply({
            flags: MessageFlags.Ephemeral,
            content: `Successfully left the fast friends game.`
        });
    };
};
