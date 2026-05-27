import { ComponentCommand, ComponentContext, Middlewares } from 'seyfert';
import helpPanel from '@/panels/help/help.js';

@Middlewares(['userLock', 'guildConfig'])
export default class extends ComponentCommand {
    customId = 'help.switch-page';
    componentType = 'StringSelect' as const;

    run = async (context: ComponentContext<'StringSelect', 'guildConfig'>) => {
        await context.update({ ...(await helpPanel(context, context.interaction.data.values[0]!)) });
    };
};
