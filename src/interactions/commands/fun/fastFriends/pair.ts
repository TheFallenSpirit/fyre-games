import { redis } from '@/app.js';
import { wait } from '@fallencodes/seyfert-utils';
import { CommandContext, createChannelOption, createNumberOption, Declare, Middlewares, Options, SubCommand } from 'seyfert';
import { PermissionsBitField } from 'seyfert/lib/structures/extra/Permissions.js';
import { ChannelType, MessageFlags, OverwriteType } from 'seyfert/lib/types/index.js';

const pairPermissions = new PermissionsBitField(['ViewChannel', 'Connect', 'Stream', 'UseVAD']);
const everyonePermissions = new PermissionsBitField(['Connect']);

const options = {
    time: createNumberOption({
        required: true,
        min_value: 1,
        max_value: 30,
        description: 'How long to pair each couple for (in minutes, min 1, max 30).'
    }),
    'group-size': createNumberOption({
        required: true,
        min_value: 2,
        max_value: 8,
        description: 'How many participants should be in each group (min 2, max 8).'
    }),
    category: createChannelOption({
        required: true,
        description: 'The category channel to create the pair VCs in.',
        channel_types: [ChannelType.GuildCategory]
    })
};

@Declare({
    name: 'pair',
    description: 'Pair fast friends participants into private VCs.',
    botPermissions: ['Administrator'],
    defaultMemberPermissions: ['ManageEvents']
})

@Options(options)
@Middlewares(['fastFriendsGame'])

export default class extends SubCommand {
    run = async (context: CommandContext<typeof options>) => {
        const channel = await context.channel();
        const memberIds = await redis.smembers(`fg_ff_members:${channel.id}`);

        if (memberIds.length < 4) return context.editOrReply({
            flags: MessageFlags.Ephemeral,
            content: 'Hold up! There needs to be at least 4 participants to do pairing.'
        });

        const groupSize = context.options['group-size'];
        if ((memberIds.length % groupSize) !== 0) return context.editOrReply({
            flags: MessageFlags.Ephemeral,
            content: `Hold up! ${memberIds.length} participants can't be evenly paired into groups of ${groupSize}.`
        });

        const guild = await context.guild();
        if (!guild) return context.replyWith(context, 'guildUnavailable');

        const time = context.options.time;
        const pairs = createPairs(memberIds, groupSize);
        const groupCount = memberIds.length / groupSize;

        await context.editOrReply({
            content: `Loading! Pairing ${memberIds.length} participants into ${groupCount} groups...`
        });
        
        let channelIndex = 1;

        for await (const pair of pairs) {
            const pairChannel = await guild.channels.create({
                type: ChannelType.GuildVoice,
                name: `Fast Friends Pair ${channelIndex}`,
                parent_id: context.options.category.id,
                permission_overwrites: [
                    { id: guild.id, type: OverwriteType.Role, deny: everyonePermissions.bits.toString() },
                    ...pair.map((id) => ({ id, type: OverwriteType.Member, allow: pairPermissions.bits.toString() }))
                ]
            }).catch(() => {});
            if (!pairChannel) continue;

            for await (const userId of pair) await guild.members.edit(
                userId,
                { channel_id: pairChannel.id },
                'Automated Action: User paired for fast friends'
            );

            setTimeout(async () => {
                for await (const userId of pair) await guild.members.edit(
                    userId,
                    { channel_id: channel.id },
                    'Automated Action: User moved back after fast friends game ended'
                );

                await pairChannel.delete(
                    'Automated Action: Fast friends game ended.'
                );
            }, time * 60_000);

            await wait(1250);
        };

        await context.editOrReply({
            content: `Successfully paired ${memberIds.length} participants into ${groupCount} groups for ${time} minutes.`
        });

        await redis.del(
            `fg_ff_active:${channel.id}`,
            `fg_ff_members:${channel.id}`
        );
    };
};

function createPairs(members: string[], groupSize: number): [string, string][] {
    const pairs: [string, string][] = [];
    const shuffled = members.toSorted(() => Math.random() - 0.5);

    for (let index = 0; index < shuffled.length; index += groupSize) {
        pairs.push(shuffled.slice(index, index + groupSize) as [string, string]);
    };

    return pairs;
};
