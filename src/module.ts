import { Client, ParseClient, ParseGlobalMiddlewares, ParseMiddlewares } from 'seyfert';
import middlewares, { globalMiddlewares } from './middlewares/export.js';

declare module 'seyfert' {
    interface UsingClient extends ParseClient<Client<true>> {}
    interface GlobalMetadata extends ParseGlobalMiddlewares<typeof globalMiddlewares> {}
    interface RegisteredMiddlewares extends ParseMiddlewares<typeof middlewares> {}

    interface InternalOptions {
        withPrefix: true;
    }
}
