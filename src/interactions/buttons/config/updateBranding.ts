import { createFileUpload, createModal, createTextInput } from '@fallencodes/seyfert-utils/components/modal';
import { ComponentCommand, ComponentContext, Middlewares } from 'seyfert';
import { TextInputStyle } from 'seyfert/lib/types/index.js';

@Middlewares(['guildConfig'])
export default class extends ComponentCommand {
    customId = 'config.branding.update';
    componentType = 'Button' as const;

    run = async (context: ComponentContext<'Button', 'guildConfig'>) => {
        const guild = await context.guild();
        if (!guild) return context.replyWith(context, 'guildUnavailable');

        const me = await context.me();
        if (!me) return context.replyWith(context, 'selfNotMember', { guild: guild.name });

        await context.modal(createModal({
            title: `Update Branding • ${guild.name}`,
            customId: `config.branding.update:${context.interaction.message.id}:${context.author.id}`,
            components: [
                createTextInput({
                    label: 'Display Name',
                    style: TextInputStyle.Short,
                    value: me.nick ?? context.client.me.username,
                    required: false,
                    customId: 'nick',
                    maxLength: 32,
                    placeholder: context.client.me.username,
                    description: `${context.client.me.username}'s display name in ${guild.name}.`
                }),
                createTextInput({
                    label: 'Bio',
                    style: TextInputStyle.Paragraph,
                    required: false,
                    customId: 'bio',
                    maxLength: 190,
                    description: `${context.client.me.username}'s profile bio/about me in ${guild.name}.`
                }),
                createFileUpload({
                    label: 'Avatar',
                    required: false,
                    customId: 'avatar',
                    maxValues: 1,
                    description: `${context.client.me.username}'s avatar in ${guild.name}.`
                }),
                createFileUpload({
                    label: 'Banner',
                    required: false,
                    customId: 'banner',
                    maxValues: 1,
                    description: `${context.client.me.username}'s profile banner in ${guild.name}.`
                })
            ]
        }));
    };
};
