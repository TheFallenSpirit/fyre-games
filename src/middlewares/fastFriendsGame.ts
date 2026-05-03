import { redis } from '@/app.js';
import { createMiddleware } from 'seyfert';
import { MessageFlags } from 'seyfert/lib/types/index.js';

export default createMiddleware<void>(async ({ next, context }) => {
    const channel = await context.channel();
    if (!channel.isVoice() && !channel.isStage()) return context.replyWith(context, 'voiceBasedChannelOnly');

    const gameExists = await redis.exists(`fg_ff_active:${channel.id}`) === 1;
    if (!gameExists) return context.editOrReply({
        flags: MessageFlags.Ephemeral,
        content: `Hold up! There is no active fast friends game in this channel.`
    });

    next();
});
