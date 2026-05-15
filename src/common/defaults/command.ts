import { validateOptions } from '@fallencodes/seyfert-utils/options';
import { CommandContext, OnOptionsReturnObject } from 'seyfert';
import { MessageFlags } from 'seyfert/lib/types/index.js';
import { onBotPermissionsFail, onPermissionsFail } from './global.js';

export default {
    onOptionsError,
    onPermissionsFail,
    onBotPermissionsFail
};

async function onOptionsError(context: CommandContext, metadata: OnOptionsReturnObject) {
    const lines = [`Hold up! `];
    const errors = await validateOptions(metadata);

    if (errors.length === 1) lines.push(`${errors[0]}`); else lines.push(
        `The following errors were found with your command usage:\n`,
        errors.map((e) => `- ${e}`).join('\n')
    );

    return context.editOrReply({
        flags: MessageFlags.Ephemeral,
        content: lines.join('')
    });
};
