import { AutoLoad, Command, Declare, Middlewares } from 'seyfert';

@Declare({
    name: 'opt',
    contexts: ['Guild'],
    description: 'Opt-in or opt-out from roleplay in this server.'
})

@AutoLoad()
@Middlewares(['profile'])

export default class extends Command {};
