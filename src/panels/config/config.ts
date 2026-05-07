import { createPanel } from '@/common/panel.js';
import home from './home.js';
import { AnyContext, Collection } from 'seyfert';
import { createStringSelect } from '@fallencodes/seyfert-utils/components/message';
import { MessageFlags } from 'seyfert/lib/types/index.js';
import { ComponentInteractionMessageUpdate } from 'seyfert/lib/common/index.js';
import branding from './branding.js';

const panel = createPanel<true>({
    home,
    branding
});

export default async (context: AnyContext, pageId: string = 'home'): Promise<ComponentInteractionMessageUpdate> => {
    const guild = await context.guild();
    if (!guild) return ({ flags: MessageFlags.Ephemeral, content: context.client.lang('guildUnavailable') });

    const pages = new Collection(panel);
    const selectMenu = createStringSelect({
        customId: `config.switch-page:${context.author.id}`,
        placeholder: 'Select a config page to view other settings.',
        options: pages.map((page, key) => ({
            value: key,
            label: page.title,
            emoji: page.emoji?.(context),
            default: key === pageId,
            description: page.description(context.client, guild)
        }))
    });

    const options = await pages.get(pageId)!.render(context, guild);
    return ({ ...options, flags: MessageFlags.IsComponentsV2, components: [...options.components, selectMenu] });
};
