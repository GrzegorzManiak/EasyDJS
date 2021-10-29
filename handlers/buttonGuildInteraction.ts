const bot = require("../"),
    userHelper = require("../helpers/userClass.ts"),
    { performance } = require('perf_hooks'),
    config = bot.config.get();

import { Schema as CommandSchema } from "../commands";

exports.handler = async(interaction:any) => {
    // start a performance timer
    let speedTest:number = performance.now();

    // Splits the message content up into words eg => aa bb cc = ['aa','bb','cc']
    let parameters:any = bot.decodeCustomID(interaction?.customId);
    
    // Check if the command exists
    let command:CommandSchema = bot.commands.get(parameters.commandName);

    // If the command dosent exists, return
    if(command === undefined) return interaction.deferReply();

    // can the button be clicked in a guild?
    if(command.button.executesInGuild !== true) return interaction.deferReply();

    let user:any = new userHelper.user(interaction.user.id, interaction.guild.id, bot.client),
        roles:string[] = await user.getRolesName(),
        hasPermissions:boolean = await user.hasRoles(command?.roles?.user) || config?.devid?.includes(interaction?.user?.id) || false;

    switch(hasPermissions) {
        case true:
            interaction.author = interaction.user;

            command.buttonInteraction({ 
                parameters, 
                interaction, 
                roles,
                user,
                speedTest,
                performance,
                slashCommand: false, 
                directMessage: false,
            });
            break;

        case false:
            interaction.reply({ 
                content: `<@${interaction.user.id}> You dont have the sufficient privileges to execute this button.`,
                ephemeral: true,
            });
            break;
    }
}