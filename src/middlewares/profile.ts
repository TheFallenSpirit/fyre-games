import Profile, { ProfileI } from '@/models/Profile.js';
import { cacheProfile, getProfile } from '@/store/profile.js';
import { isInstalled } from '@fallencodes/seyfert-utils';
import { createMiddleware } from 'seyfert';

export default createMiddleware<ProfileI>(async ({ next, context }) => {
    if (!isInstalled(context)) throw new Error('profile middleware called from non guild command');
    let profile = await getProfile(context.guildId!, context.author.id);

    if (!profile) {
        const newProfile = await Profile.create({ guildId: context.guildId!, userId: context.author.id });
        profile = newProfile.toObject();
        await cacheProfile(profile);
    };

    next(profile);
});
