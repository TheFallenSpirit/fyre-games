import { AnyContext, Client, ParseClient, ParseGlobalMiddlewares, ParseMiddlewares } from 'seyfert';
import middlewares, { globalMiddlewares } from './middlewares/middlewares.js';
import { LangKey, LangProps } from './common/lang.js';

declare module 'seyfert' {
    interface UsingClient extends ParseClient<Client<true>> {}
    interface GlobalMetadata extends ParseGlobalMiddlewares<typeof globalMiddlewares> {}
    interface RegisteredMiddlewares extends ParseMiddlewares<typeof middlewares> {}

    interface ExtendContext {
        replyWith: (context: AnyContext, key: LangKey, props?: LangProps) => void;
    }

    interface InternalOptions {
        withPrefix: true;
    }
}
