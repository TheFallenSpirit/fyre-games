import { defaultConfig } from '@/middlewares/config.js';
import { createModal, createTextInput } from '@fallencodes/seyfert-utils/components/modal';
import { ComponentCommand, ComponentContext, Middlewares } from 'seyfert';
import { TextInputStyle } from 'seyfert/lib/types/index.js';

@Middlewares(['guildConfig'])
export default class extends ComponentCommand {
    customId = 'config.home.settings';
    componentType = 'Button' as const;

    run = async (context: ComponentContext<'Button', 'guildConfig'>) => {
        const guild = await context.guild();
        if (!guild) return context.replyWith(context, 'guildUnavailable');

        await context.modal(createModal({
            title: `Update Settings • ${guild.name}`,
            customId: `config.home.settings:${context.interaction.message.id}:${context.author.id}`,
            components: [
                createTextInput({
                    label: 'Prefix',
                    style: TextInputStyle.Short,
                    value: context.globalMetadata.c.prefix,
                    customId: 'prefix',
                    minLength: 1,
                    maxLength: 3,
                    placeholder: defaultConfig.prefix,
                    description: `The prefix for text commands in this server.`
                }),
                createTextInput({
                    label: 'Accent Color',
                    style: TextInputStyle.Short,
                    value: `#${context.globalMetadata.c.color.toString(16).padStart(6, '0')}`,
                    customId: 'accent-color',
                    minLength: 7,
                    maxLength: 7,
                    placeholder: `#${defaultConfig.color.toString(16).padStart(6, '0')}`,
                    description: 'The accent color for embeds in this server.'
                })
            ]
        }));
    };
};
