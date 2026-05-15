import { Client, ClientOptions } from 'seyfert';
import _lang, { LangKey, LangProps } from './common/lang.js';
import { basename } from 'node:path';

export default class FyreClient extends Client<true> {
    constructor(options: ClientOptions) {
        super(options);
        this.events.filter = (path) => !basename(path).startsWith('_');
        this.commands.filter = (path) => !basename(path).startsWith('_');
    };

    public lang = (key: LangKey, props?: LangProps) => {
        return _lang(this, key, props);
    };
};
