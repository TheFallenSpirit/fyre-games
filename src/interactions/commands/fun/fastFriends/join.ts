import { redis } from '@/app.js';
import { CommandContext, Declare, Middlewares, SubCommand } from 'seyfert';
import { MessageFlags } from 'seyfert/lib/types/index.js';

@Declare({
    name: 'join',
    description: 'Join the fast friends game in this channel.'
})

@Middlewares(['fastFriendsGame'])
export default class extends SubCommand {
    run = async (context: CommandContext) => {
        const channel = await context.channel();

        const isMember = await redis.sismember(
            `fg_ff_members:${channel.id}`,
            context.author.id
        ) === 1;

        if (isMember) return context.editOrReply({
            flags: MessageFlags.Ephemeral,
            content: `Hold up! You're already in this game silly.`
        });

        const voiceState = await context.member?.voice().catch(() => undefined);
        if (voiceState?.channelId !== channel.id) return context.editOrReply({
            flags: MessageFlags.Ephemeral,
            content: `Hold up! You must be connected to ${channel} to join this game.`
        });

        await redis.sadd(
            `fg_ff_members:${channel.id}`,
            context.author.id
        );

        await context.editOrReply({
            flags: MessageFlags.Ephemeral,
            content: `Successfully joined the fast friends game.`
        });
    };
};
