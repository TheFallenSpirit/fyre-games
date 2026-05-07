import { defaultConfig } from '@/middlewares/config.js';
import configPanel from '@/panels/config/config.js';
import { Command, CommandContext, Declare, Middlewares } from 'seyfert';

@Declare({
    name: 'config',
    aliases: ['cfg'],
    contexts: ['Guild'],
    description: `View or update this server's ${defaultConfig.username} config.`,
    defaultMemberPermissions: ['ManageGuild']
})

@Middlewares(['guildConfig'])

export default class extends Command {
    run = async (context: CommandContext<{}, 'guildConfig'>) => {
        await context.deferReply();
        await context.editOrReply({ ...(await configPanel(context)) });      
    };
};
