import { config } from 'seyfert';

export default config.bot({
    token: process.env.DISCORD_TOKEN ?? '',
    intents: [
        'Guilds',
        'GuildMembers',
        'GuildMessages',
        'MessageContent',
        'GuildVoiceStates'
    ],
    locations: {
        base: 'build/src',
        events: 'events',
        commands: 'interactions/commands',
        components: 'interactions'
    }
});
