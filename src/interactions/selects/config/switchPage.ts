import configPanel from '@/panels/config/config.js';
import { ComponentCommand, ComponentContext, Middlewares } from 'seyfert';

@Middlewares(['guildConfig'])
export default class extends ComponentCommand {
    customId = 'config.switch-page';
    componentType = 'StringSelect' as const;

    run = async (context: ComponentContext<'StringSelect', 'guildConfig'>) => {
        await context.update({ ...(await configPanel(context, context.interaction.data.values[0]!)) });
    };
};
