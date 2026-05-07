import config from './config.js';
import fastFriendsGame from './fastFriendsGame.js';
import guildConfig from './guildConfig.js';
import userLock from './userLock.js';

export const globalMiddlewares = {
    c: config
};

export default {
    ...globalMiddlewares,
    userLock,
    guildConfig,
    fastFriendsGame
};
