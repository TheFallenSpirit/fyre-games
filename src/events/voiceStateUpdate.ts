import { redis } from '@/app.js';
import { createEvent, VoiceState } from 'seyfert';

export default createEvent({
    data: { name: 'voiceStateUpdate' },
    run: async ([state, oldState]) => {
        if (oldState?.channelId) await fastFriendsGameCheck(state, oldState);
    }
});

async function fastFriendsGameCheck(state: VoiceState, oldState: VoiceState) {
    const isParticipant = await redis.sismember(`fg_ff_members:${oldState.channelId}`, state.userId);
    if (isParticipant) await redis.srem(`fg_ff_members:${oldState.channelId}`, state.userId);
};
