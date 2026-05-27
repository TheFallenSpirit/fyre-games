import { defaultConfig } from '@/middlewares/config.js';
import { Command, CommandContext, createStringOption, Declare, Options } from 'seyfert';
import helpPanel from '@/panels/help/help.js';

const options = {
    page: createStringOption({
        description: 'The help panel page to open.',
        choices: [
            { name: 'Home', value: 'home' },
            { name: 'Game Commands', value: 'game' },
            { name: 'Utility commands', value: 'utility' },
            { name: 'Admin Commands', value: 'admin' }
        ]
    })
};

@Declare({
    name: 'help',
    contexts: ['Guild', 'BotDM', 'PrivateChannel'],
    description: `View a list of ${defaultConfig.username}'s commands and categories.`,
    props: { category: 'utility' }
})

@Options(options)

export default class extends Command {
    run = async (context: CommandContext<typeof options>) => {
        await context.deferReply();
        const page = context.options.page ?? 'home';
        await context.editOrReply({ ...(await helpPanel(context, page)) }); 
    };
};
