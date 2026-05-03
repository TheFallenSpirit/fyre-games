import { createContainer, createSeparator, createTextDisplay } from '@fallencodes/seyfert-utils/components/message';
import { Command, CommandContext, Declare } from 'seyfert';
import { MessageFlags } from 'seyfert/lib/types/index.js';

@Declare({
    name: 'ping',
    contexts: ['Guild', 'BotDM', 'PrivateChannel'],
    description: 'View my current gateway and application ping.'
})

export default class extends Command {
    run = async (context: CommandContext) => {
        const createdTimestamp = (context.message?.createdTimestamp ?? context.interaction?.createdTimestamp)!;
        const incomingPing = Date.now() - createdTimestamp;

        const startTimestamp = performance.now();
        await context.editOrReply({ content: `Testing application ping...` });
        const restPing = performance.now() - startTimestamp;

        const lines = [
            `⚡ **Shard ID**: ${context.shardId}\n`,
            `🤖 **Response Time**: ${(incomingPing + restPing).toFixed()}ms\n\n`,
            `📊 **Stats for Nerds**\n\`\`\`txt\n`,
            `REST :::: ${restPing.toFixed()}ms\n`,
            `Event ::: ${incomingPing}ms\n`,
            `Gateway : ${context.client.gateway.latency}ms\n`,
            `\`\`\``
        ];

        const container = createContainer([
            createTextDisplay(`### 🌐 Ping - ${context.client.me.username}\n`),
            createSeparator(1, false),
            createTextDisplay(lines.join(''))
        ], { color: context.globalMetadata.c.color });

        await context.editOrReply({
            flags: MessageFlags.IsComponentsV2,
            content: null,
            components: [container]
        });
    };
};
