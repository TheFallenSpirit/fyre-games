import { redis } from '@/app.js';
import { CommandContext, Declare, Middlewares, SubCommand } from 'seyfert';

@Declare({
    name: 'end',
    description: 'End the fast friends game in this channel.',
    defaultMemberPermissions: ['ManageEvents']
})

@Middlewares(['fastFriendsGame'])
export default class extends SubCommand {
    run = async (context: CommandContext) => {
        const channel = await context.channel();
        await redis.del(`fg_ff_active:${channel.id}`, `fg_ff_members:${channel.id}`);
        await context.editOrReply({ content: `Successfully ended the fast friends game in ${channel}.` });
    };
};
