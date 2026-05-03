import { handleMessageComponent, handleModal } from '@fallencodes/seyfert-utils/handleCommand';
import { HandleCommand } from 'seyfert/lib/commands/handle.js';
import { Yuna } from 'yunaforseyfert';

export default class extends HandleCommand {
    modal = handleModal;
    messageComponent = handleMessageComponent;

    argsParser = Yuna.parser({
        breakSearchOnConsumeAllOptions: true
    });

    resolveCommandFromContent = Yuna.resolver({
        client: this.client,
        afterPrepare: () => this.client.logger.info('Yuna resolver has successfully loaded.')
    });
};
