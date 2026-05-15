import { sendPermissions } from '@/common/permissions.js';
import { CountingI } from '@/models/Guild/Counting.js';
import { ProfileI } from '@/models/Profile.js';
import { getGuild, updateGuild } from '@/store/guild.js';
import { getOrCreateProfile, updateProfile } from '@/store/profile.js';
import { colors } from '@fallencodes/seyfert-utils';
import { createContainer, createTextDisplay } from '@fallencodes/seyfert-utils/components/message';
import { UpdateQuery } from 'mongoose';
import { Message } from 'seyfert';
import { MessageFlags } from 'seyfert/lib/types/index.js';

export default async function checkCount(message: Message) {
    const countingConfig = (await getGuild(message.guildId!))?.counting;
    if (!countingConfig || countingConfig.channelId !== message.channelId) return;

    const me = await message.client.members.fetch(message.guildId!, message.client.me.id).catch(() => undefined);
    if (!me) return;

    const permissions = await message.client.channels.memberPermissions(message.channelId, me);
    if (!permissions.has(sendPermissions.values())) return;

    if (!message.content.match(/^\d/)) {
        if (countingConfig.numbersOnly !== false) await resetCount(
            message,
            countingConfig,
            `message text didn't start with a number`
        );

        return;
    };

    if (countingConfig.lastCounterId === message.author.id) return resetCount(
        message,
        countingConfig,
        `you can't count two numbers in a row`
    );

    const providedNumber = parseInt(message.content.trim().replaceAll(',', '').replaceAll('.', ''));
    if (isNaN(providedNumber)) return resetCount(message, countingConfig, `message text wasn't a valid number`);

    const currentNumber = countingConfig.currentNumber ?? 0;
    const targetNumber = currentNumber + 1;

    if (providedNumber !== targetNumber) return resetCount(
        message,
        countingConfig,
        `wrong number provided, ${targetNumber} was expected`
    );

    await updateGuild(message.guildId!, {
        $inc: { 'counting.currentNumber': 1 },
        $set: { 'counting.lastCounterId': message.author.id }
    });

    let emoji = '✅';
    if (countingConfig.customEmojis?.correct) emoji = countingConfig.customEmojis.correct;

    await message.react(emoji).catch(async (error) => {
        if (!String(error).includes('Unknown Emoji')) return;
        await updateGuild(message.guildId!, { $unset: { 'counting.customEmojis.correct': '' } });
        await message.react('✅').catch(() => {});
    });

    const query: UpdateQuery<ProfileI> = { $inc: { 'counting.totalCounts': 1 } };
    const profile = await getOrCreateProfile(message.guildId!, message.author.id);

    if (targetNumber > (profile.counting?.highestCount ?? 0)) query.$set = {
        'counting.highestCount': targetNumber
    };

    await updateProfile(
        message.guildId!,
        message.author.id,
        query
    );

    if (countingConfig.failRoleId && permissions.has(['ManageRoles'])) {
        const failRole = await message.client.roles.fetch(
            message.guildId!,
            countingConfig.failRoleId
        ).catch(() => undefined);

        const meHighestRole = await me.roles.highest();
        if (!failRole || failRole.position >= meHighestRole.position) return await updateGuild(
            message.guildId!,
            { $unset: { 'counting.failRoleId': '' } }
        );

        await message.client.proxy.guilds(message.guildId!).members(message.author.id).roles(failRole.id).put({
            reason: 'Automated Action: Member ruined the current counting game; adding configured fail role'
        });
    };
};

async function resetCount(message: Message, countingConfig: CountingI, reason: string) {
    await updateGuild(message.guildId!, {
        $set: { 'counting.currentNumber': 0 },
        $unset: { 'counting.lastCounterId': '' }
    });

    let emoji = '❌';
    if (countingConfig.customEmojis?.incorrect) emoji = countingConfig.customEmojis.incorrect;

    await message.react(emoji).catch(async (error) => {
        if (!String(error).includes('Unknown Emoji')) return;
        await updateGuild(message.guildId!, { $unset: { 'counting.customEmojis.incorrect': '' } });

        emoji = '❌';
        await message.react(emoji).catch(() => {});
    });

    const lines = [
        `### ${emoji} Count Ruined at ${countingConfig.currentNumber ?? 0}!\n`,
        `${message.author}, ${reason}.\n`,
        `The next number is **1**, have fun starting over.`
    ];

    const container = createContainer(
        [createTextDisplay(lines.join(''))],
        { color: colors.lightRed }
    );

    await message.reply({
        flags: MessageFlags.IsComponentsV2,
        components: [container],
        allowed_mentions: { parse: [], replied_user: true }
    });
};
