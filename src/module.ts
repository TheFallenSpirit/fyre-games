import { AnyContext, ParseClient, ParseGlobalMiddlewares, ParseMiddlewares } from 'seyfert';
import middlewares, { globalMiddlewares } from './middlewares/middlewares.js';
import { LangKey, LangProps } from './common/lang.js';
import FyreClient from './client.js';

declare module 'seyfert' {
    interface GlobalMetadata extends ParseGlobalMiddlewares<typeof globalMiddlewares> {}
    interface RegisteredMiddlewares extends ParseMiddlewares<typeof middlewares> {}

    interface ExtraProps {
        category?: 'games' | 'admin' | 'roleplay' | 'utility';
    }

    interface UsingClient extends ParseClient<FyreClient> {
        lang: (key: LangKey, props?: LangProps) => string;
    }

    interface ExtendContext {
        replyWith: (context: AnyContext, key: LangKey, props?: LangProps) => void;
    }

    interface InternalOptions {
        withPrefix: true;
    }
}
