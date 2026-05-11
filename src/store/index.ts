import { UpdateQuery } from 'mongoose';

export function transformUndefinedToUnset<Model>(query: UpdateQuery<Model>): UpdateQuery<Model> {
    if (!query.$set) return query;
    query.$unset = query.$unset ?? {};

    for (const [key, value] of Object.entries(query.$set)) {
        if (![null, undefined].includes(value)) continue;
        delete query.$set[key];
        query.$unset = { ...query.$unset, [key]: 0 };
    };

    return query;
};
