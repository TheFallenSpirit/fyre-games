import { AnyPanelContext, createPanel } from '@/common/panel.js';
import { AnyContext, Collection, Command, ExtraProps, Guild, IgnoreCommand, SubCommand, UsingClient } from 'seyfert';
import { createStringSelect } from '@fallencodes/seyfert-utils/components/message';
import { ComponentInteractionMessageUpdate } from 'seyfert/lib/common/index.js';
import { isInstalled } from '@fallencodes/seyfert-utils';
import home from './home.js';
import { MessageFlags } from 'seyfert/lib/types/index.js';
import game from './game.js';
import admin from './admin.js';
import utility from './utility.js';

const panel = createPanel<false>({
    home,
    game,
    utility,
    admin
});

export default async (
    context: AnyPanelContext,
    pageId: string = 'home'
): Promise<ComponentInteractionMessageUpdate> => {
    let guild: Guild<'api' | 'cached'> | undefined;
    if (isInstalled(context)) guild = await context.guild().catch(() => undefined);

    const pages = new Collection(panel);
    const options = await pages.get(pageId)!.render(context, guild);

    const selectMenu = createStringSelect({
        customId: `help.switch-page:${context.author.id}`,
        placeholder: 'Select a help page to view other categories and commands.',
        options: pages.map((page, key) => ({
            value: key,
            label: page.title,
            emoji: page.emoji?.(context),
            default: key === pageId,
            description: page.description?.(context.client, guild)
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

export function displayCommand(context: AnyContext, command: HelpCommand): string {
    const prefix = context.globalMetadata.c.prefix;
    const getCmd = context.client.getCmd.bind({});

    const lines: string[] = [
        `\n${(command.subCommands && command.subCommands.length > 0) ? '\n' : ''}- `,
        command.ignore === IgnoreCommand.Slash ? `**\`${prefix}${command.name}\`**` : getCmd(command.name),
        command.aliases?.map((alias) => ` \`${alias}\``).join('') || '',
        ` - ${command.description}`
    ];

    if (command.subCommands) lines.push(...command.subCommands.map((command) => {
        let name = command.parentName;
        if (command.group) name += ` ${command.group}`;
        name += ` ${command.name}`;

        return [
            `\n  - ${command.ignore === IgnoreCommand.Slash ? `**\`${prefix}${name}` : getCmd(name)}`,
            ` - ${command.description}`
        ].join('');
    }));

    return lines.join('');
};

export function getCommandList(client: UsingClient, category: NonNullable<ExtraProps['category']>): HelpCommand[] {
    const commands: HelpCommand[] = [];

    const rawCommands = client.commands.values.filter((command) => {
        let isCategoryCommand = command.props.category === category;

        if (command instanceof Command) {
            const subCommands = command.options?.filter((option) => (option instanceof SubCommand)) ?? [];
            if (subCommands.length > 0) isCategoryCommand = !!subCommands.find(({ props }) => props.category === category);
        };

        return isCategoryCommand;
    });
    
    for (const command of rawCommands) {
        const subCommands: HelpSubCommand[] = [];
        const isChatCommand = (command instanceof Command);

        if (isChatCommand) {
            const rawSubCommands = command.options?.filter((subCommand) => {
                return (subCommand instanceof SubCommand);
            }).filter(({ props }) => props.category === category) ?? [];

            for (const subCommand of rawSubCommands) subCommands.push({
                name: subCommand.name,
                group: subCommand.group,
                ignore: subCommand.ignore,
                parentName: command.name,
                description: subCommand.description
            });
        };

        commands.push({
            name: command.name,
            ignore: isChatCommand ? command.ignore : undefined,
            aliases: isChatCommand ? command.aliases : undefined,
            description: isChatCommand ? command.description : undefined,
            subCommands: isChatCommand ? subCommands : undefined
        });
    };

    return commands;
};

interface HelpCommand {
    name: string;
    ignore?: IgnoreCommand;
    aliases?: string[];
    description?: string;
    subCommands?: HelpSubCommand[];
}

interface HelpSubCommand extends HelpCommand {
    group?: string;
    parentName: string;
}
