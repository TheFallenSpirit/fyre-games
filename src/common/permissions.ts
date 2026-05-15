import { PermissionsBitField } from 'seyfert/lib/structures/extra/Permissions.js';
import { PermissionFlagsBits } from 'seyfert/lib/types/index.js';

export const sendPermissions = new PermissionsBitField([
    PermissionFlagsBits.EmbedLinks,
    PermissionFlagsBits.ViewChannel,
    PermissionFlagsBits.AttachFiles,
    PermissionFlagsBits.AddReactions,
    PermissionFlagsBits.SendMessages
]);
