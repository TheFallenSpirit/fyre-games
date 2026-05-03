import { redis } from '@/app.js';
import { createContainer, createSeparator, createTextDisplay } from '@fallencodes/seyfert-utils/components/message';
import { CommandContext, Declare, Middlewares, SubCommand } from 'seyfert';
import { MessageFlags } from 'seyfert/lib/types/index.js';

@Declare({
    name: 'list',
    description: 'List the members in the fast friends game in this channel.',
    defaultMemberPermissions: ['ManageEvents']
})

@Middlewares(['fastFriendsGame'])
export default class extends SubCommand {
    run = async (context: CommandContext) => {
        const channel = await context.channel();
        const memberIds = await redis.smembers(`fg_ff_members:${channel.id}`);
        
        if (memberIds.length < 1) return context.editOrReply({
            flags: MessageFlags.Ephemeral,
            content: 'There are no participants in this fast friends game.'
        });

        await context.deferReply();
        const memberNames: string[] = [];

        for await (const userId of memberIds) {
            const user = await context.client.users.fetch(userId);
            memberNames.push(`- ${user} (@${user.username})`);
        };

        const container = createContainer([
            createTextDisplay(`### (${memberIds.length}) Fast Friends Participants • ${channel}`),
            createSeparator(1, false),
            createTextDisplay(memberNames.join('\n'))
        ], { color: context.globalMetadata.c.color });

        await context.editOrReply({
            flags: MessageFlags.IsComponentsV2,
            content: null,
            components: [container],
            allowed_mentions: { parse: [] }
        });
    };
};
