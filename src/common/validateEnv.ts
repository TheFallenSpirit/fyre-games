import { readFileSync } from 'node:fs';
import { red } from 'seyfert/lib/common/index.js';

export default function validateEnv() {
    const exampleEnv = readFileSync('.env.example').toString();
    const envKeys = exampleEnv.split('\n').map((key) => key.split('=').at(0))
    .filter((key) => typeof key === 'string');

    for (const key of envKeys) {
        if (process.env[key]) continue;
        console.error(red(`The required environment variable "${key}" wasn't found!`));
        process.exit(1);
    };
};
