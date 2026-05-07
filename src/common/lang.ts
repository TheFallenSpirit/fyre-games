import { s } from '@fallencodes/seyfert-utils';
import { UsingClient } from 'seyfert';

export type LangKey = keyof typeof lines;
export type LangProps = Record<string, any>;

export default (client: UsingClient, key: LangKey, props: Record<string, any> = {}) => {
    let line = lines[key].replaceAll('{self}', s(client.me.username));

    return Object.entries(props).reduce((accumulator, [key, value]) => {
        return accumulator.replaceAll(`{${key}}`, s((value ?? 'undefined').toString()));
    }, line);
};

const lines = {
    invalidHex: `Hold up! The provided hex code "{hex}" isn't valid (format: #ff0000).`,
    selfNotMember: "Hold up! {self} wasn't able to fetch it's info in {guild}.",
    guildUnavailable: "Hold up! {self} wasn't able to fetch this server's info, please try again later.",
    channelUnavailable: "Hold up! {self} wasn't able to fetch this channel's info, please try again.",
    voiceBasedChannelOnly: 'Hold up! This command can only be used in voice or stage channels.'
};
