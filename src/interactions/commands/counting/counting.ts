import { AutoLoad, Command, Declare, Groups, Middlewares } from 'seyfert';

@Declare({
    name: 'counting',
    contexts: ['Guild'],
    description: 'View the counting leaderboards or manage the counting module.'
})

@Groups({
    set: { defaultDescription: 'Manage the counting module in this server.' }
})

@AutoLoad()
@Middlewares(['guildConfig'])

export default class extends Command {};
