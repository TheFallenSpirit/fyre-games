import { getGuild } from '@/store/guild.js';
import { truncateString } from '@fallencodes/seyfert-utils';
import { AutocompleteInteraction, AutoLoad, Command, Declare, Middlewares } from 'seyfert';

@Declare({
    name: 'whip-lines',
    aliases: ['wl'],
    contexts: ['Guild'],
    description: `Manage this server's roleplay whip lines.`,
    defaultMemberPermissions: ['ManageGuild'],
    props: { category: 'admin' }
})

@AutoLoad()
@Middlewares(['guildConfig'])

export default class extends Command {};

export async function linesAutocomplete(interaction: AutocompleteInteraction) {
    const guildConfig = await getGuild(interaction.guildId!);

    const whipLines = guildConfig?.whipLines ?? [];
    if (whipLines.length < 1) return interaction.respond([{ name: 'No whip lines', value: -1 }]);

    await interaction.respond(whipLines.map((line, index) => ({
        name: truncateString(line, 100),
        value: index
    })));
};
