import { createEvent } from 'seyfert';

export default createEvent({
    data: { name: 'botReady', once: true },
    run: async (user, client) => {
        client.logger.info(`Successfully connected to Discord as ${user.tag}.`);
        await client.uploadCommands({ cachePath: './commands.json' });
    }
});
