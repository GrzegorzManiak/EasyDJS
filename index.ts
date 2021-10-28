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

//Handlers
client.on('messageCreate', async(interaction: any) => {
    if(interaction.guildId === null)
        require('./handlers/directMessage').handler(interaction);

    else
        require('./handlers/guildMessage').handler(interaction);
});

module.exports = {
    start: () => start(),
    config: configHelper,
    commands: commandsHelper,
    client: client
}