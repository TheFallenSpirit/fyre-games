import { redis } from '@/app.js';
import { updateProfile } from '@/store/profile.js';
import { name, s } from '@fallencodes/seyfert-utils';
import { Command, CommandContext, createUserOption, Declare, Middlewares, Options } from 'seyfert';
import { MessageFlags } from 'seyfert/lib/types/index.js';
import { DeclareParserConfig } from 'yunaforseyfert';

const options = {
    user: createUserOption({
        required: true,
        description: 'The member to whip.'
    })
};

@Declare({
    name: 'whip',
    contexts: ['Guild'],
    description: 'Whip a member and make them say a random line.',
    botPermissions: ['ManageChannels', 'ManageWebhooks'],
    props: { category: 'roleplay' }
})

@Options(options)
@Middlewares(['profile', 'guildConfig'])
@DeclareParserConfig({ useRepliedUserAsAnOption: { requirePing: false } })

export default class extends Command {
    run = async (context: CommandContext<typeof options, 'guildConfig'>) => {
        const guild = await context.guild();
        if (!guild) return context.replyWith(context, 'guildUnavailable');

        const whipLines = context.metadata.guildConfig.whipLines ?? [];
        if (whipLines.length < 1) return context.editOrReply({
            flags: MessageFlags.Ephemeral,
            content: `Hold up! ${s(guild.name)} doesn't have any configured whip lines.`
        });

        const channel = await context.channel();
        if (!channel.isGuildTextable()) return context.editOrReply({
            flags: MessageFlags.Ephemeral,
            content: `Hold up! You can only whip members in textable channels.`
        });

        const user = context.options.user;
        let webhookData: { id: string, token: string } | undefined;
        const cachedWebhook = await redis.get(`fg_webhook:${channel.id}`);

        if (cachedWebhook) {
            const [id, token] = cachedWebhook.split(':');
            webhookData = { id: id!, token: token! };
        };

        if (!webhookData) {
            const webhooks = await channel.webhooks.list();
            let webhook = webhooks.find(({ applicationId }) => applicationId === context.client.me.id);
            if (!webhook) webhook = await channel.webhooks.create({ name: context.client.me.username });
            webhookData = { id: webhook.id, token: webhook.token! };
        };

        try {
            await context.client.webhooks.writeMessage(webhookData.id, webhookData.token, {
                body: {
                    content: whipLines[Math.floor(Math.random() * whipLines.length)],
                    username: name(user, 'display'),
                    avatar_url: user.avatarURL()
                },
                query: {
                    wait: true
                }
            });

            await updateProfile(guild.id, user.id, { $inc: { 'interactions.whips.received': 1 } });
            await updateProfile(guild.id, context.author.id, { $inc: { 'interactions.whips.given': 1 } });
        } catch (_error) {
            await redis.del(`fg_webhook:${channel.id}`);
        };
    };
};
