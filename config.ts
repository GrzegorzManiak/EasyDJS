export interface Schema {
    log: boolean;
    allowslashcommands: boolean;
    allowdmcommands: boolean;
    allowdminteractions: boolean;
    guildid: string | undefined;
    prefix: string;
    token: string;
};

let ConfigValues:Schema = {
    log: false,
    allowslashcommands: true,
    allowdmcommands: false,
    allowdminteractions: false,
    guildid: undefined,
    prefix: '',
    token: '',
};

module.exports = {
    set: (config: Schema) => {
        Object.assign(ConfigValues, config);
    },

    get: () => {
        return ConfigValues;
    }
}