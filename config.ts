export interface Schema {
    log: boolean;
    allowslashcommands: boolean;
    allowdmcommands: boolean;
    allowdminteractions: boolean;
    guild: string | undefined;
    prefix: string;
    token: string;
};

let ConfigValues:Schema = {
    log: false,
    allowslashcommands: true,
    allowdmcommands: false,
    allowdminteractions: false,
    guild: undefined,
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