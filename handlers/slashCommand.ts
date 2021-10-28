const bot = require("../"),
    userHelper = require("../helpers/userClass.ts"),
    { performance } = require('perf_hooks'),
    config = bot.config.get();

import { Schema as CommandSchema } from "../commands";

exports.handler = async(interaction:any) =>{
    if(config.allowslashcommands !== true)
        return interaction.reply({ 
            content: 'Slash commands are turned off.', 
            ephemeral: true 
        });
    
    // start a performance timer
    let speedTest:number = performance.now();
    
    let parameters:string[] = [interaction.commandName];

    // Check if the command exists
    let command:CommandSchema = bot.commands.get(parameters[0]);

    // If the command dosent exists, return
    if(command === undefined) return;

    let user:any = new userHelper.user(interaction.user.id, interaction.guild.id, bot.client),
        roles:string[] = await user.getRolesName(),
        hasPermissions:boolean = await user.hasRoles(command?.roles?.user) || config?.devid?.includes(interaction?.author?.id) || false;

    switch(hasPermissions) {
        case true:
            interaction.author = interaction.user;

            return command.mainFunc({ 
                parameters,
                interaction,
                slashCommand: true, 
                directMessage: false,
                roles,
                user,
                speedTest,
                performance
            });

        case false:
            return interaction.reply({ 
                content: `<@${interaction.user.id}> You dont have the sufficient privileges to execute this command.`
            });
    }
}
