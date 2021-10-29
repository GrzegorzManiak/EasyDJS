const bot = require("../"),
    userHelper = require("../helpers/userClass.ts"),
    { performance } = require('perf_hooks'),
    config = bot.config.get();

import { Schema as CommandSchema } from "../commands";

exports.handler = async(interaction:any) => {
    // start a performance timer
    let speedTest:number = performance.now();

    // if direct message commands are disabled in the config, return
    if (config.allowdmcommands !== true) return;

    // If the message dosent begin with the command prefix, return.
    if (interaction.content.split("")[0] !== config.prefix) return;

    // Splits the message content up into words eg => aa bb cc = ['aa','bb','cc']
    let parameters:string[] = interaction.content.split(" ");

    // Remove the first character from the first item in the array, aka the prefix
    parameters[0] = parameters[0]?.substring(1)?.toLowerCase();

    // Check if the command exists
    let command:CommandSchema = bot.commands.get(parameters[0]);

    // If the command dosent exists, return
    if (command === undefined) return;

    // If the command dosent allow it self to execute in the dm's
    if (command.executesInDm !== true) return;

    // If the bot isint configured correctly, return and allert
    if (config.guildid === undefined && command.linkedToGuild === true)
        return console.log(
            'You havent defined guildid in the config, dm commands that have "linkedToGuild" set to true wont work without a guildid.'
        );
    
    // Dose this command require a guildid to be set to function?
    switch ((command.linkedToGuild as boolean)) {
        case true:
            let user: any = new userHelper.user(interaction.author.id, config.guildid, bot.client), // get the user
                roles: string[] = await user.getRolesName(), // Get the users roles
                hasPermissions: boolean = (await user.hasRoles(command?.roles?.user)) || config?.devid?.includes(interaction?.author?.id) || false; // check if they have permision to exec the command

            switch (hasPermissions) {
                case true:
                    return command.mainFunc({
                        parameters,
                        interaction,
                        roles,
                        user,
                        speedTest,
                        performance,
                        slashCommand: false,
                        directMessage: true,
                    });

                case false:
                    return interaction.reply({
                        content: `<@${interaction.author.id}> You dont have the sufficient privileges to execute this command.`,
                    });

                default:
                    return;
            }

        case false:
            return command.mainFunc({
                parameters,
                interaction,
                speedTest,
                performance,
                slashCommand: false,
                directMessage: true,
            });
    }
};
