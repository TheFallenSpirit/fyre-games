import { AnyPanelContextWithGuildConfig, createPanel } from '@/common/panel.js';
import home from './home.js';
import { Collection } from 'seyfert';
import { createStringSelect } from '@fallencodes/seyfert-utils/components/message';
import { MessageFlags } from 'seyfert/lib/types/index.js';
import { ComponentInteractionMessageUpdate } from 'seyfert/lib/common/index.js';
import roleplay from './roleplay.js';
import fastFriends from './fastFriends.js';
import counting from './counting.js';

const panel = createPanel<true>({
    home,
    roleplay,
    counting,
    fastFriends
});

export default async (
    context: AnyPanelContextWithGuildConfig,
    pageId: string = 'home'
): Promise<ComponentInteractionMessageUpdate> => {
    const guild = await context.guild();
    if (!guild) return ({ flags: MessageFlags.Ephemeral, content: context.client.lang('guildUnavailable') });

    const pages = new Collection(panel);
    const options = await pages.get(pageId)!.render(context, guild);

    const selectMenu = createStringSelect({
        customId: `config.switch-page:${context.author.id}`,
        placeholder: 'Select a config page to view other settings.',
        options: pages.map((page, key) => ({
            value: key,
            label: page.title,
            emoji: page.emoji?.(context),
            default: key === pageId
        }))
    });

    let flags = MessageFlags.IsComponentsV2;
    if (options.flags) flags = flags | options.flags;

    return ({
        ...options,
        flags,
        components: [...options.components ?? [], selectMenu],
        allowed_mentions: { parse: [] }
    });
};
