import { createModal, createTextInput } from '@fallencodes/seyfert-utils/components/modal';
import { ComponentCommand, ComponentContext, Middlewares } from 'seyfert';
import { TextInputStyle } from 'seyfert/lib/types/index.js';

@Middlewares(['userLock', 'guildConfig'])
export default class extends ComponentCommand {
    customId = 'config.fast-friends.pair-channel-name-format';
    componentType = 'Button' as const;

    run = async (context: ComponentContext<'Button', 'guildConfig'>) => {
        const guildConfig = context.metadata.guildConfig;

        await context.modal(createModal({
            title: 'Update Fast Friends Pair Channel Name',
            customId: `config.fast-friends.pair-channel-name-format:${context.interaction.message.id}:${context.author.id}`,
            components: [
                createTextInput({
                    label: 'Channel Name Format',
                    style: TextInputStyle.Short,
                    value: guildConfig.fastFriends?.defaultPairChannelNameFormat ?? 'Fast Friends Pair {number}',
                    customId: 'format',
                    minLength: 10,
                    maxLength: 100,
                    description: 'The default name format for new fast friends pair channels.'
                })
            ]
        }));
    };
};
