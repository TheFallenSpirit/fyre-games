import { createEvent, UsingClient } from 'seyfert';
import { ApplicationCommandOptionType, ApplicationCommandType } from 'seyfert/lib/types/index.js';

export default createEvent({
    data: { name: 'botReady', once: true },
    run: async (user, client) => {
        client.logger.info(`Successfully connected to Discord as ${user.tag}.`);
        await client.uploadCommands({ cachePath: './commands.json' });
        await storeCommandMentions(client);
    }
});

async function storeCommandMentions(client: UsingClient) {
    const commands = await client.proxy.applications(client.me.id).commands.get().catch(() => undefined);
    if (!commands) return;

    for (const command of commands.filter(({ type }) => type === ApplicationCommandType.ChatInput)) {
        const localCommand = client.commands.values.find(({ name }) => command.name === name);
        if (!localCommand) continue

        const subCommands = command.options?.filter((option) => {
            return option.type === ApplicationCommandOptionType.Subcommand;
        }) ?? [];

        const subCommandGroups = command.options?.filter((option) => {
            return option.type === ApplicationCommandOptionType.SubcommandGroup;
        }) ?? [];

        if (subCommands.length < 1 && subCommandGroups.length < 1) {
            client.commandMentions.push(`</${command.name}:${command.id}>`);
            continue;
        };

        for (const subCommand of subCommands) {
            client.commandMentions.push(`</${command.name} ${subCommand.name}:${command.id}>`);
        };

        for (const subCommandGroup of subCommandGroups) {
            const subCommands = subCommandGroup.options ?? [];
            for (const subCommand of subCommands) client.commandMentions.push(
                `</${command.name} ${subCommandGroup.name} ${subCommand.name}:${command.id}>`
            );
        };
    };
};
