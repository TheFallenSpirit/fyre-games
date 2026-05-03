import { AnyContext, extendContext, Message } from 'seyfert';
import { defaultConfig } from './middlewares/config.js';
import { getGuild } from './store/guild.js';
import lang, { LangKey, LangProps } from './common/lang.js';
import { MessageFlags } from 'seyfert/lib/types/index.js';

export async function prefix(message: Message) {
    if (!message.guildId) return [defaultConfig.prefix];
    const guildConfig = await getGuild(message.guildId);
    return [guildConfig?.prefix ?? defaultConfig.prefix];
};

export const context = extendContext((_interaction) => ({
    replyWith: (context: AnyContext, key: LangKey, props?: LangProps) => {
        return context.editOrReply({ flags: MessageFlags.Ephemeral, content: lang(context.client, key, props) });
    }
}));
