import { redis } from '@/app.js';
import Profile, { ProfileI } from '@/models/Profile.js';
import { replacer, reviver } from '@fallencodes/seyfert-utils';
import { seconds } from 'itty-time';
import { UpdateQuery } from 'mongoose';

export async function getProfile(guildId: string, userId: string): Promise<ProfileI | undefined> {
    const cachedProfile = await redis.get(`fg_profile:${guildId}:${userId}`);
    if (cachedProfile) return JSON.parse(cachedProfile, reviver) as ProfileI;

    const dbProfile = await Profile.findOne({ guildId, userId });
    if (!dbProfile) return;

    const profileObject = dbProfile.toObject();
    await cacheProfile(profileObject);
    return profileObject;
};

export async function updateProfile(guildId: string, userId: string, query: UpdateQuery<ProfileI>): Promise<ProfileI> {
    const profile = await Profile.findOneAndUpdate({ guildId, userId }, query, { returnDocument: 'after' });
    if (!profile) throw new Error(`Profile not found during updateProfile -- ${guildId}:${userId}`);

    const profileObject = profile.toObject();
    await cacheProfile(profileObject);
    return profileObject;
};

export async function getOrCreateProfile(guildId: string, userId: string): Promise<ProfileI> {
    let profile = await getProfile(guildId, userId);
    
    if (!profile) {
        const newProfile = await Profile.create({ guildId, userId });
        profile = newProfile.toObject();
        await cacheProfile(profile);
    };

    return profile;
};

export async function cacheProfile(profile: ProfileI) {
    await redis.set(
        `fg_profile:${profile.guildId}:${profile.userId}`,
        JSON.stringify(profile, replacer),
        'EX',
        seconds('3 days')
    );
};
