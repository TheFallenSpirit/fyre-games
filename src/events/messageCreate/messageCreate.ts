import { createEvent } from 'seyfert';
import checkCount from './_checkCount.js';

export default createEvent({
    data: { name: 'messageCreate' },
    run: async (message) => {
        if (message.author.bot || !message.guildId) return;
        await checkCount(message);
    }
});
