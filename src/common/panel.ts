import { CommandContext, ComponentContext, ModalContext, Guild as SeyfertGuild, TopLevelBuilders, UsingClient } from 'seyfert';
import { MessageFlags } from 'seyfert/lib/types/index.js';

export function createPanel<InGuild extends boolean>(data: Record<string, PanelPage<InGuild>>) {
    return new Map<string, PanelPage<InGuild>>(Object.entries(data));
};

export interface PanelPage<InGuild extends boolean> {
    title: string;
    emoji?: (context: InGuild extends true ? AnyPanelContextWithGuildConfig : AnyPanelContext) => string;
    render: (
        context: InGuild extends true ? AnyPanelContextWithGuildConfig : AnyPanelContext,
        guild: InGuild extends true ? Guild : Guild | undefined
    ) => Promise<RenderProps>;
    description?: (client: UsingClient, guild: InGuild extends true ? Guild : Guild | undefined) => string;
}

interface RenderProps {
    flags?: MessageFlags;
    content?: string | null;
    components?: TopLevelBuilders[];
}

type Guild = SeyfertGuild<'api' | 'cached'>

export type AnyPanelContext =
| CommandContext
| ComponentContext
| ModalContext

export type AnyPanelContextWithGuildConfig =
| CommandContext<{}, 'guildConfig'>
| ComponentContext<any, 'guildConfig'>
| ModalContext<'guildConfig'>
