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
        commandDescription: 'a set of test functions'
    },

    roles: {
        user: ['test']
    },
    
    executesInDm: true,
    linkedToGuild: true,
    isMessageCommand: false,

    mainFunc: function(input:any){
        let mainEmbed = [{
            color: 0x0099ff,
            title: 'Test command',
            description: '',
            footer: {
                text: `Test Command`,
            },
        }];

        if(input.parameters[1][0].value === 'button') {
            let testButton = new easyDJS.discordJS.MessageActionRow()
                .addComponents(
                    new easyDJS.discordJS.MessageButton()
                    .setCustomId(easyDJS.createCustomID('test', { action: 'test' }))
                    .setLabel("Test")
                    .setStyle('DANGER')
                )

            input.interaction.reply({
                embeds: mainEmbed,
                components: [testButton],
            })
        }
    },

    buttonInteraction: function(input:any){
        console.log(input)
    },

    parameters: [
        { 
            type: 'string',
            name: 'type', 
            description: 'a command that spawns in a test message', 
            required: true,
            choices: [
                {
                    name: 'button',
                    value: 'button'
                },
                {
                    name: 'menu',
                    value: 'menu'
                }
            ]
        }
    ]
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

//let encoded:string = easyDJS.createCustomID('poo', { pee: 'poo' })
//console.log(encoded, easyDJS.decodeCustomID(encoded))