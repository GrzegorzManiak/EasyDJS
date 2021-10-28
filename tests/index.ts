const easyDJS = require('../index');
const token = require('./token');

easyDJS.config.set({
    token: token.token,
    prefix: '.',
    guildid: '892820301224751175',
    allowdmcommands: true
});

easyDJS.commands.add({
    details: {
        commandName: 'test',
        commandDescription: 'test'
    },

    roles: {
        user: ['test']
    },
    
    executesInDm: true,
    linkedToGuild: true,

    mainFunc: function(input:any){
        console.log('1')
    }
});

easyDJS.commands.add({
    details: {
        commandName: 'test2',
        commandDescription: 'test2'
    },

    roles: {
        user: ['test']
    },

    executesInDm: true,
    linkedToGuild: false,

    mainFunc: function(input:any){
        console.log(input)
    }
});

easyDJS.commands.add({
    details: {
        commandName: 'ping',
        commandDescription: 'tests latency'
    },

    executesInDm: true,
    linkedToGuild: false,

    mainFunc: async function(input:any){
        input.interaction.channel.send(`<@${input.interaction.author.id}> Pong and the bot's ping is **${easyDJS.client.ws.ping} ms** round trip, with an **internal speed** speed of **${input.performance.now() - input.speedTest} ms** for this command.`)
    }
});

easyDJS.commands.loadSlashCommands(true)

easyDJS.start();