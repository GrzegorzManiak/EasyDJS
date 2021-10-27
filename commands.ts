let addedCommands:any = {};
const commandHistory:any = {};
const slashCommandBuilder = require('@discordjs/builders').SlashCommandBuilder;

import { client } from './index';

export interface Schema {
    details: {
        commandName:string;
        commandDescription:string;
    };

    roles: {
        user:[]; // Roles that can call the actual command
        menu:[]; // Roles that can interact with the menu attached to the command
        button:[]; // Roles that can click the buttons attached to the command
        reaction:[]; // Roles that can interact with reactions attached to the command
    };

    parameters:[]; // Paramters = [{ type:'', name:'', description: '', required: false }]
    executesInDm:boolean; // Can the command execute in the users DM, Will use role data from the server defined in the config.serverid, leave false otherwise
    interactionsInDm:boolean; // If a msg is sent to the user with attached interactables, can the user use them?
    isSlashCommand:boolean; // Can this command be executed with discord slash commands?
    helpEmbedPage:number; 
    linkedToGuild:boolean; // defines if the command can be executed without configuring a static guild id in the config

    buttonInteraction?:Function;
    slashInteraction?:Function;
    menuInteraction?:Function;

    mainFunc:Function
};

interface InputSchema {
    parameters: any;
    interaction: any;
    slashCommand: boolean;
    directMessage: boolean;
}

const commandTemplate:Schema = {
    details: {
        commandName: '',
        commandDescription: '',
    },

    roles: {
        user: [], // Roles that can call the actual command
        menu: [], // Roles that can interact with the menu attached to the command
        button: [], // Roles that can click the buttons attached to the command
        reaction: [], // Roles that can interact with reactions attached to the command
    },

    parameters: [], // Paramters = [{ type:'', name:'', description: '', required: false }]
    executesInDm: false, // Can the command execute in the users DM, Will use role data from the server defined in the config.serverid, leave false otherwise
    linkedToGuild: true, 
    interactionsInDm: true, // If a msg is sent to the user with attached interactables, can the user use them?
    isSlashCommand: true, // Can this command be executed with discord slash commands?
    helpEmbedPage: 0, 

    mainFunc: function(input:InputSchema){}
};

function add(command:Schema) {
    // Create a new Object
    let clone:any = {};

    // Clone the template into the new object
    Object.assign(clone,
        commandTemplate)

    // Assign the command paramaters to that new Object
    Object.assign(clone,
        command);

    // Add it to the command stack
    addedCommands[clone.details.commandName.toLowerCase()] = clone as Schema;
    
    // Add it to the command history
    commandHistory[clone.details.commandName.toLowerCase()] = clone as Schema;
}

function get(toFind:any = undefined, temp:any = undefined):Schema | undefined {
    // If a specific command to find (toFind) is not defined, return all commands.
    if(toFind === undefined) return addedCommands;

    Object.keys(addedCommands).forEach((key) => {
        if(toFind.toLowerCase() === key) temp = addedCommands[key];
    });

    return temp;
}

function remove(toRemove:string):boolean {
    toRemove = toRemove.toLowerCase();

    let command = get(toRemove);
    if(command === undefined) return false;

    delete addedCommands[toRemove];
    return true;
}

function clear(){
    addedCommands = {}
}

function loadSlashCommands(global:boolean) {
    client.on('ready', () => {
        client.guilds.cache.forEach((guild:any) => {
            let commands:any = guild.commands;
        
            Object.keys(addedCommands).forEach(command => {
                if(addedCommands[command]?.isSlashCommand !== true) return;
        
                let data:any = new slashCommandBuilder()
                    .setName(command) // give the command a name
                    .setDescription(addedCommands[command].details.commandDescription); // give the command a description
        
                commands.create(data).catch((err:any) => {
                    // You need to allow the bot to add slash commands to your server, most people forget about this and get confused about the error.
                    if(err.httpStatus == 403) console.log(`You need to give the bot oauth the "bot" oauth2 premision to use slash commands on [${guild.id} / ${guild.name}] => https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=applications.commands%20bot`);
                });
            })
        })
    })
}

module.exports = {
    add: (command:Schema) => {
        add(command);
    },

    get: (toFind:any):Schema | undefined => {
        return get(toFind);
    },

    remove: (toRemove:string):boolean => {
        return remove(toRemove);
    },

    clear: () => {
        clear();
    },

    loadSlashCommands: (global:boolean = false) => {
        loadSlashCommands(global);
    }
}