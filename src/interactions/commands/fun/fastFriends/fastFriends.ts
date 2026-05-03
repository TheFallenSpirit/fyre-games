import { AutoLoad, Command, Declare, Middlewares } from 'seyfert';

@Declare({
    name: 'fast-friends',
    aliases: ['ff'],
    contexts: ['Guild'],
    description: 'Join, leave, or manage a fast friends game.'
})

@AutoLoad()
@Middlewares(['guildConfig'])

export default class extends Command {};
