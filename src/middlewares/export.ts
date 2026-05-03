import config from './config.js';
import fastFriendsGame from './fastFriendsGame.js';
import guildConfig from './guildConfig.js';

export const globalMiddlewares = {
    c: config
};

export default {
    ...globalMiddlewares,
    guildConfig,
    fastFriendsGame
};
