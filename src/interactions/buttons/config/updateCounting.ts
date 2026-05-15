import { createChannelSelect, createModal, createRoleSelect, createStringSelectMenu } from '@fallencodes/seyfert-utils/components/modal';
import { ComponentCommand, ComponentContext, Middlewares } from 'seyfert';

@Middlewares(['userLock', 'guildConfig'])
export default class extends ComponentCommand {
    customId = 'config.counting.update';
    componentType = 'Button' as const;

    run = async (context: ComponentContext<'Button', 'guildConfig'>) => {
        const guild = await context.guild();
        if (!guild) return context.replyWith(context, 'guildUnavailable');
        const countingConfig = context.metadata.guildConfig.counting;

        await context.modal(createModal({
            title: `Updating Counting - ${guild.name}\n`,
            customId: `config.counting.update:${context.interaction.message.id}:${context.author.id}`,
            components: [
                createChannelSelect({
                    label: 'Counting Channel',
                    required: false,
                    customId: 'channel',
                    maxValues: 1,
                    placeholder: 'Select a channel for members to count in.',
                    description: 'The channel for members to count in.',
                    defaultValues: countingConfig?.channelId ? [countingConfig.channelId] : []
                }),
                createRoleSelect({
                    label: 'Fail Role',
                    required: false,
                    customId: 'fail-role',
                    maxValues: 1,
                    placeholder: 'Select a role to add to members when they mess up.',
                    description: 'The role to add to members when they mess up the count.',
                    defaultValues: countingConfig?.failRoleId ? [countingConfig.failRoleId] : []
                }),
                createStringSelectMenu({
                    label: 'Numbers Only',
                    customId: 'numbers-only',
                    maxValues: 1,
                    placeholder: 'Select a state for numbers only mode.',
                    description: 'If messages without numbers should reset the counter.',
                    options: [
                        {
                            label: 'Enabled',
                            value: 'true',
                            default: countingConfig?.numbersOnly !== false,
                            description: 'Messages without numbers will reset the counter.'
                        },
                        {
                            label: 'Disabled',
                            value: 'false',
                            default: countingConfig?.numbersOnly === false,
                            description: 'Messages without numbers will be ignored.'
                        }
                    ]
                })
            ]
        }));
    };
};
