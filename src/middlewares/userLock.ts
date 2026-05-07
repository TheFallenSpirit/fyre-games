import { createMiddleware } from 'seyfert';
import { MessageFlags } from 'seyfert/lib/types/index.js';

export default createMiddleware<void>(async ({ next, context }) => {
    if (!('customId' in context)) return next();
    const userId = context.customId.split(':').at(-1)!;

    if (userId !== context.author.id) return context.editOrReply({
        flags: MessageFlags.Ephemeral,
        content: `Hold up! This interaction isn't meant for you.`
    });

    next();
});
