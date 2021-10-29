let addedCommands:any = {};
const commandHistory:any = {};

import { triggerAsyncId } from 'async_hooks';
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

    parameters: Array<ParamtersSchema> // Paramters = [{ type:'', name:'', description: '', required: false }]
    executesInDm:boolean; // Can the command execute in the users DM, Will use role data from the server defined in the config.serverid, leave false otherwise
    interactionsInDm:boolean; // If a msg is sent to the user with attached interactables, can the user use them?
    isSlashCommand:boolean; // Can this command be executed with discord slash commands?
    helpEmbedPage:number; 
    removeInvoker:boolean; // if true, removes the message that invoked the command.
    linkedToGuild:boolean; // defines if the command can be executed without configuring a static guild id in the config
    isMessageCommand:boolean;
    
    button: {
        executesInDm: boolean;
        executesInGuild: boolean;
        linkedToGuild: boolean,
    };

    menu: {
        executesInDm: boolean;
        executesInGuild: boolean;
        linkedToGuild: boolean,
    };

    buttonInteraction:Function;
    slashInteraction:Function;
    menuInteraction:Function;
    mainFunc:Function
};

export interface InputSchema {
    parameters: any;
    interaction: any;
    slashCommand: boolean;
    speedTest:number;
    performance: any;
    directMessage: boolean;
}

export interface ParamtersSchema {
    type: string;
    name: string;
    description: string;
    required?: boolean;
    choices?: [{
        name: string;
        value: string | number;
    }]
}

const OPTION_TYPES:string[] = [ 
    'STRING', 
    'INTEGER', 
    'NUMBER', 
    'BOOLEAN', 
    'USER', 
    'CHANNEL', 
    'ROLE', 
    'MENTIONABLE', 
    'SUB_COMMAND', 
    'SUB_COMMAND_GROUP' 
];

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
    removeInvoker: true,
    interactionsInDm: true, // If a msg is sent to the user with attached interactables, can the user use them?
    isSlashCommand: true, // Can this command be executed with discord slash commands?
    isMessageCommand: true, // Can this command be executed with a plain text message in a guild?
    helpEmbedPage: 0, 

    button:{
        executesInDm: false,
        executesInGuild: true,
        linkedToGuild: true,
    },

    menu:{
        executesInDm: false,
        executesInGuild: true,
        linkedToGuild: true,
    },

    buttonInteraction: function(input:InputSchema){},
    slashInteraction: function(input:InputSchema){},
    menuInteraction: function(input:InputSchema){},
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
                
                let slashCommand:any = {
                    name: command,
                    description: addedCommands[command].details.commandDescription,
                    options: [],
                }

                addedCommands[command].parameters.forEach((parameter:ParamtersSchema) => {
                    if(!OPTION_TYPES.includes(parameter.type.toUpperCase())) return;

                    let param:any = {};

                    param.type = parameter.type.toUpperCase();
                    param.name = parameter.name;
                    param.description = parameter.description;
                    param.required = parameter?.required || false;
                    param.choices = parameter.choices;

                    slashCommand.options = [...slashCommand.options, param ];
                });

                commands.create(slashCommand).catch((err:any) => {
                    // You need to allow the bot to add slash commands to your server, most people forget about this and get confused about the error.
                    if(err.httpStatus == 403) console.log(`You need to give the bot oauth the "bot" oauth2 premision to use slash commands on [${guild.id} / ${guild.name}] => https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=applications.commands%20bot`);
                    else console.log(err);
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