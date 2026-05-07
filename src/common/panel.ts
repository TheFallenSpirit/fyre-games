import { AnyContext, Guild as SeyfertGuild, TopLevelBuilders, UsingClient } from 'seyfert';
import { MessageFlags } from 'seyfert/lib/types/index.js';

export function createPanel<InGuild extends boolean>(data: Record<string, PanelPage<InGuild>>) {
    return new Map<string, PanelPage<InGuild>>(Object.entries(data));
};

export interface PanelPage<InGuild extends boolean> {
    title: string;
    emoji?: (context: AnyContext) => string;
    render: (context: AnyContext, guild: InGuild extends true ? Guild : Guild | undefined) => Promise<RenderProps>;
    description: (client: UsingClient, guild: InGuild extends true ? Guild : Guild | undefined) => string;
}

interface RenderProps {
    flags?: MessageFlags;
    content?: string | null;
    components?: TopLevelBuilders[];
}

type Guild = SeyfertGuild<'api' | 'cached'>
