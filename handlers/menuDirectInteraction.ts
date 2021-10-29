const bot = require("../"),
    userHelper = require("../helpers/userClass"),
    { performance } = require('perf_hooks'),
    config = bot.config.get();

import { Schema as CommandSchema } from "../commands";
import { ParametersSchema } from "../index";

exports.handler = async(interaction:any) => {
    // start a performance timer
    let speedTest:number = performance.now();

    // Splits the message content up into words eg => aa bb cc = ['aa','bb','cc']
    let parameters:ParametersSchema = bot.decodeCustomID(interaction?.customId);
    
    // Check if the command exists
    let command:CommandSchema = bot.commands.get(parameters.commandName);

    // If the command dosent exists, return
    if(command === undefined) return interaction.deferUpdate();

    // can the menu be clicked in a dm?
    if(parameters?.executesInDm !== true) return interaction.deferUpdate();

    // If the bot isint configured correctly, return and allert
    if (config.guildid === undefined && parameters?.linkedToGuild === true)
        return console.log(
            'You havent defined guildid in the config, dm commands that have "linkedToGuild" set to true wont work without a guildid.'
        );
    
    // Dose this command require a guildid to be set to function?
    switch ((parameters?.linkedToGuild as boolean)) {
        case true:
            let user:any = new userHelper.user(interaction.user.id, config.guildid, bot.client),
                roles:string[] = await user.getRolesName(),
                hasPermissions:boolean = await user.hasRoles(command?.roles?.user) || config?.devid?.includes(interaction?.user?.id) || false;

            switch (hasPermissions) {
                case true:
                    interaction.author = interaction.user;

                    command.menuInteraction({ 
                        parameters, 
                        interaction, 
                        roles,
                        user,
                        speedTest,
                        performance,
                        slashCommand: false, 
                        directMessage: true,
                    });
                    break;

                case false:
                    interaction.reply({ 
                        content: `<@${interaction.user.id}> You dont have the sufficient privileges to execute this button.`,
                        ephemeral: true,
                    });
                    break;
            }
            break;

        case false:
            return command.menuInteraction({
                parameters,
                interaction,
                speedTest,
                performance,
                slashCommand: false,
                directMessage: true,
            });
    }
}