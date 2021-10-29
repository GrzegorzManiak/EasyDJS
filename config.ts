export interface Schema {
    log: boolean;
    allowslashcommands: boolean;
    allowdmcommands: boolean;
    allowdminteractions: boolean;
    guildid: string | undefined;
    prefix: string;
    token: string;
};

const ConfigValues:Schema = {
    log: false,
    allowslashcommands: true,
    allowdmcommands: false,
    allowdminteractions: false,
    guildid: undefined,
    prefix: '',
    token: '',
};

module.exports = {
    get: () => {
        return ConfigValues;
    },

    set: (config: Schema) => {
        Object.assign(ConfigValues, config);
    },
}