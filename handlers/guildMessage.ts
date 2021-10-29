const bot = require("../"),
    userHelper = require("../helpers/userClass"),
    { performance } = require('perf_hooks'),
    config = bot.config.get();

import { Schema as CommandSchema } from "../commands";

exports.handler = async(interaction:any) => {
    // start a performance timer
    let speedTest:number = performance.now();

    // If the message dosent begin with the command prefix, return.
    if (interaction.content.split('')[0] !== config.prefix) return;

    // Splits the message content up into words eg => aa bb cc = ['aa','bb','cc']
    let parameters:string[] = interaction.content.split(' ');

    // Remove the first character from the first item in the array, aka the prefix
    parameters[0] = parameters[0]?.substring(1)?.toLowerCase();
    
    // Check if the command exists
    let command:CommandSchema = bot.commands.get(parameters[0]);

    // If the command dosent exists, return
    if(command === undefined) return;

    // Can this command be executed as a message in the guild?
    if(command.isMessageCommand !== true) return;

    let user:any = new userHelper.user(interaction.author.id, interaction.guild.id, bot.client),
        roles:string[] = await user.getRolesName(),
        hasPermissions:boolean = await user.hasRoles(command?.roles?.user) || config?.devid?.includes(interaction?.author?.id) || false;

    switch(hasPermissions) {
        case true:
            command.mainFunc({ 
                parameters, 
                interaction, 
                roles,
                user,
                speedTest,
                performance,
                slashCommand: false, 
                directMessage: false,
                removeInvoker: () => {
                    interaction.delete().catch();
                }
            })
            break;

        case false:
            interaction.reply({ 
                content: `<@${interaction.author.id}> You dont have the sufficient privileges to execute this command.`
            }).then(() => {
                if(command.removeInvoker === true) interaction.delete().catch();
            });
            break;
    }
}