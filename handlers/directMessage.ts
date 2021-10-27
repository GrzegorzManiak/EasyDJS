const bot = require("../"),
  userHelper = require("../helpers/userClass.ts"),
  config = bot.config.get();

import { Schema as CommandSchema } from "../commands";

exports.handler = async (message: any) => {
    // if direct message commands are disabled in the config, return
    if (config.allowdmcommands !== true) return;

    // If the message dosent begin with the command prefix, return.
    if (message.content.split("")[0] !== config.prefix) return;

    // Splits the message content up into words eg => aa bb cc = ['aa','bb','cc']
    let splitMessage: string[] = message.content.split(" ");

    // Remove the first character from the first item in the array, aka the prefix
    splitMessage[0] = splitMessage[0]?.substring(1)?.toLowerCase();

    // Check if the command exists
    let command: CommandSchema = bot.commands.get(splitMessage[0]);

    // If the command dosent exists, return
    if (command === undefined) return;

    // If the command dosent allow it self to execute in the dm's
    if (command.executesInDm !== true) return;

    // If the bot isint configured correctly, return and allert
    if (config.guildid === undefined && command.linkedToGuild === true)
        return console.log(
            'You havent defined guildid in the config, dm commands that have "linkedToGuild" set to true wont work without a guildid.'
        );

    switch ((command.linkedToGuild as boolean)) {
        case true:
            let user: any = new userHelper.user(message.author.id, config.guildid, bot.client),
                roles: string[] = await user.getRolesName(),
                hasPermissions: boolean = (await user.hasRoles(command?.roles?.user)) || config?.devid?.includes(message?.author?.id) || false;

            switch (hasPermissions) {
                case true:
                    return command.mainFunc({
                        parameters: splitMessage,
                        interaction: message,
                        slashCommand: false,
                        directMessage: true,
                        roles,
                        user,
                    });

                case false:
                    return message.channel.send({
                        content: `<@${message.author.id}> You dont have the sufficient privileges to execute this command.`,
                    });

                default:
                    return;
            }

        case false:
            return command.mainFunc({
                parameters: splitMessage,
                interaction: message,
                slashCommand: false,
                directMessage: true
            });
    }
};
