import config from './config.js';
import fastFriendsGame from './fastFriendsGame.js';
import guildConfig from './guildConfig.js';
import profile from './profile.js';
import userLock from './userLock.js';

export const globalMiddlewares = {
    c: config
};

export default {
    ...globalMiddlewares,
    profile,
    userLock,
    guildConfig,
    fastFriendsGame
};
