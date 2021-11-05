const discordJS = require('discord.js');
   
export let client = new discordJS.Client({
    intents: [
        discordJS.Intents.FLAGS.GUILDS, //Give the bot access to its connected guilds, should only be one tho.
        discordJS.Intents.FLAGS.GUILD_MESSAGES, //Give it the ability to see incoming messages.
        discordJS.Intents.FLAGS.DIRECT_MESSAGES, //Give it the ability to see incoming messages.
        discordJS.Intents.FLAGS.GUILD_MESSAGE_REACTIONS //Gives the bot the ability to check for and add reactions
    ],
    partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});

const configHelper:any = require('./config'),
    commandsHelper:any = require('./commands');

async function start() {
    // Authenticate the bot
    client.login(configHelper.get().token);

    // Return a promise so that other code can execute after authentication
    return new Promise(function(resolve, reject) {
        // confirm that the bot authenticated
        client.on('ready', () => {
            console.log(`Logged in as ${client.user.tag}, ${client.user.id}!`);
            resolve(client);
        });
    });
}

// Handlers
client.on('messageCreate', async(interaction: any) => {
    if(interaction.guildId === null)
        require('./handlers/directMessage').handler(interaction); // Direct messages

    else
        require('./handlers/guildMessage').handler(interaction); // Guild messages
});

client.on('interactionCreate', async(interaction: any) => {
    if (interaction?.componentType === 'BUTTON') {
        if(interaction.guildId === null)
            require('./handlers/buttonDirectInteraction').handler(interaction); 
        
        else 
            require('./handlers/buttonGuildInteraction').handler(interaction); 
    }

    else if (interaction?.componentType === 'SELECT_MENU') {
        if(interaction.guildId === null)
            require('./handlers/menuDirectInteraction').handler(interaction); 
        
        else 
            require('./handlers/menuGuildInteraction').handler(interaction); 
    }

    else if (interaction?.commandName) 
        require('./handlers/slashCommand').handler(interaction);
});

export interface ParametersSchema {
    commandName: string;
    executesInDm: boolean;
    executesInGuild: boolean;
    linkedToGuild: boolean;
    value?: any;
}

function createCustomID(parameters:ParametersSchema):string {
    let parametersTemplate:any = {
        1: parameters.commandName || '', //Command name
        2: parameters.executesInDm || false, //Executes in dm
        3: parameters.executesInGuild || true, //Executes in guild 
        4: parameters.linkedToGuild || true, //linked To guild
        5: parameters.value || '' // value
    }

    let json = JSON.stringify(parametersTemplate);
    return json;
}

function decodeCustomID(json:string):ParametersSchema {
    let obj:any = JSON.parse(json);

    let decodedObject:ParametersSchema = {
        commandName: obj['1'],
        executesInDm: obj['2'],
        executesInGuild: obj['3'],
        linkedToGuild: obj['4'],
        value: obj['5'],
    }

    return decodedObject;
}

module.exports = {
    start: () => start(),
    decodeCustomID: (base64:string):any => decodeCustomID(base64),
    createCustomID: (parameters:ParametersSchema):string => createCustomID(parameters),
    config: configHelper,
    discordJS: discordJS,
    userHelper: require('./helpers/userClass'),
    commands: commandsHelper,
    client: client
}