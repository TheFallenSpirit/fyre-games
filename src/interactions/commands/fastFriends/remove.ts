import { redis } from '@/app.js';
import { CommandContext, createUserOption, Declare, Middlewares, Options, SubCommand } from 'seyfert';
import { MessageFlags } from 'seyfert/lib/types/index.js';

const options = {
    user: createUserOption({
        required: true,
        description: 'The participant to remove from the game.'
    })
};

@Declare({
    name: 'remove',
    description: 'Remove a member from the fast friends game in this channel.'
})

@Options(options)
@Middlewares(['fastFriendsGame'])

export default class extends SubCommand {
    run = async (context: CommandContext<typeof options>) => {
        const user = context.options.user;
        const channel = await context.channel();
        
        const isMember = await redis.sismember(
            `fg_ff_members:${channel.id}`,
            user.id
        ) === 1;

        if (!isMember) return context.editOrReply({
            flags: MessageFlags.Ephemeral,
            content: `Hold up! ${user} isn't in the current fast friends game.`,
            allowed_mentions: { parse: [] }
        });

        await redis.srem(
            `fg_ff_members:${channel.id}`,
            user.id
        );

        await context.editOrReply({
            flags: MessageFlags.Ephemeral,
            content: `Successfully removed ${user} from the fast friends game.`,
            allowed_mentions: { parse: [] }
        });
    };
};
