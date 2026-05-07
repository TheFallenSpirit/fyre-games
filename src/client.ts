import { Client, ClientOptions } from 'seyfert';
import _lang, { LangKey, LangProps } from './common/lang.js';

export default class FyreClient extends Client<true> {
    constructor(options: ClientOptions) {
        super(options);
    };

    public lang = (key: LangKey, props?: LangProps) => {
        return _lang(this, key, props);
    };
};
