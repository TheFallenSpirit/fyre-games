import { capitalCase } from 'change-case';
import { AnyContext, PermissionStrings } from 'seyfert';
import { MessageFlags } from 'seyfert/lib/types/index.js';

export async function onPermissionsFail(context: AnyContext, permissions: PermissionStrings) {
    const lines = [
        `Hold up! You don't have permissions to use this interaction.\nYou need the following permissions: `,
        permissions.map((permission) => `\`${capitalCase(permission.toString())}\``).join(', ')
    ];

    return context.editOrReply({
        flags: MessageFlags.Ephemeral,
        content: lines.join('')
    });
};

export async function onBotPermissionsFail(context: AnyContext, permissions: PermissionStrings) {
    const username = context.client.me.username;

    const lines = [
        `Hold up! ${username} doesn't have permissions to do this.\n${username} needs the following permissions: `,
        permissions.map((permission) => `\`${capitalCase(permission.toString())}\``).join(', ')
    ];

    return context.editOrReply({
        flags: MessageFlags.Ephemeral,
        content: lines.join('')
    });
};
