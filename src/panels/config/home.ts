import { PanelPage } from '@/common/panel.js';
import { s } from '@fallencodes/seyfert-utils';
import { createContainer, createTextDisplay, createSeparator } from '@fallencodes/seyfert-utils/components/message';

export default ({
    title: 'Home',
    description: (client, guild) => `The home page of your ${client.me.username} config in ${guild.name}.`,
    render: async (context, guild) => {
        const lines = [
            `Some super cool info :eyes:.`
        ];

        const container = createContainer([
            createTextDisplay(`### Server Config • ${s(guild.name)}`),
            createSeparator(1, false),
            createTextDisplay(lines.join(''))
        ], { color: context.globalMetadata.c.color });

        return ({ components: [container] });
    }
}) satisfies PanelPage<true>;
