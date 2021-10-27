const bot = require('../'),
    userHelper = require('../helpers/userClass.ts'),
    config = bot.config.get();

import { Schema as CommandSchema } from '../commands'

exports.handler = async(message:any) => {
    // If the message dosent begin with the command prefix, return.
    if (message.content.split('')[0] !== config.prefix) return;

    // Splits the message content up into words eg => aa bb cc = ['aa','bb','cc']
    let splitMessage:string[] = message.content.split(' ');

    // Remove the first character from the first item in the array, aka the prefix
    splitMessage[0] = splitMessage[0]?.substring(1)?.toLowerCase();
    
    // Check if the command exists
    let command:CommandSchema = bot.commands.get(splitMessage[0]);
    if(command === undefined) return;

    let user:any = new userHelper.user(message.author.id, message.guild.id, bot.client),
        roles:string[] = await user.getRolesName(),
        hasPermissions:boolean = await user.hasRoles(command?.roles?.user) || config?.devid?.includes(message?.author?.id) || false;

    switch(hasPermissions) {
        case true:
            return command.mainFunc({ 
                parameters: splitMessage, 
                interaction: message,  
                slashCommand: false, 
                directMessage: false,
                roles,
                user 
            });

        case false:
            return message.channel.send({ 
                content: `<@${message.author.id}> You dont have the sufficient privileges to execute this command.`
            });
    }
}