import { getProfile } from '@/store/profile.js';
import { isInstalled } from '@fallencodes/seyfert-utils';
import { CommandContext, createMiddleware, createUserOption } from 'seyfert';
import { MessageFlags } from 'seyfert/lib/types/index.js';

export default createMiddleware<void, CommandContext<typeof options>>(async ({ next, context }) => {
    if (!isInstalled(context)) throw new Error('roleplay middleware called from non guild command');

    const authorProfile = await getProfile(context.guildId!, context.author.id);
    if (authorProfile?.rpEnabled !== true) return context.editOrReply({
        flags: MessageFlags.Ephemeral,
        content: `Hold up! You must be opted-in to use roleplay features. Use \`/opt in\` to opt-in.`
    });

    const targetUser = context.options.user;
    const targetProfile = await getProfile(context.guildId!, targetUser.id);

    if (targetProfile?.rpEnabled !== true) return context.editOrReply({
        flags: MessageFlags.Ephemeral,
        content: `Hold up! ${targetUser} isn't opted-in to roleplay features. They can use \`/opt in\` to opt-in.`,
        allowed_mentions: { parse: [] }
    });

    next();
});

const options = {
    user: createUserOption({ required: true, description: 'a' })
};
