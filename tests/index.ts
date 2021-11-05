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
        commandName: 'testdm',
        commandDescription: 'a set of test functions'
    },

    roles: {
        user: ['test']
    },
    
    executesInDm: false,
    linkedToGuild: false,
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
                    .setCustomId(easyDJS.createCustomID({ 
                        commandName: 'testdm',
                        action: 'test',
                        executesInDm: true,
                    }))
                    .setLabel("Test")
                    .setStyle('DANGER')
                )

            input.interaction.user.send({
                embeds: mainEmbed,
                components: [testButton],
            })
        }

        else if(input.parameters[1][0].value === 'menu') {
            let testButton = new easyDJS.discordJS.MessageActionRow()
                .addComponents(
                    new easyDJS.discordJS.MessageSelectMenu()
                    .setCustomId(easyDJS.createCustomID({ 
                        commandName: 'testdm',
                        action: 'test2',
                        executesInDm: true,
                    }))
                    .addOptions([
                        { label: '1', value: '1' },
                        { label: '2', value: '2' },
                    ])
                )

            input.interaction.user.send({
                embeds: mainEmbed,
                components: [testButton],
            })
        }
    },

    buttonInteraction: function(input:any){
        input.interaction.reply({ 
            content:`<@${input.interaction.user.id}>, Successfull`,
            ephemeral: true
        });
    },

    menuInteraction: function(input:any){
        input.interaction.reply({ 
            content:`<@${input.interaction.user.id}>, Successfull`,
            ephemeral: true
        });
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
        commandName: 'ban',
        commandDescription: 'bans a user'
    },

    isMessageCommand: false,

    roles: {
        user: ['test']
    },

    mainFunc: async function(input:any){
        console.log(input.parameters[1][0].value);
        let user:any = new easyDJS.userHelper.user(input.parameters[1][0].value, input.interaction.guild.id, easyDJS.client)
        await user.getUser();
        let banned:boolean = await user.ban({ reason:'ur retarded' });
        console.log(banned);
        input.interaction.reply('banned');
    },

    parameters: [
        { 
            type: 'user',
            name: 'user', 
            description: 'the user to ban', 
            required: true,
        }
    ]
});

easyDJS.commands.add({
    details: {
        commandName: 'unban',
        commandDescription: 'unbans a user'
    },

    isMessageCommand: false,

    roles: {
        user: ['test']
    },

    mainFunc: async function(input:any){
        console.log(input.parameters[1][0].value);
        let user:any = new easyDJS.userHelper.user(input.parameters[1][0].value, input.interaction.guild.id, easyDJS.client)
        let banned:boolean = await user.unban();
        console.log(banned);
        input.interaction.reply('unbanned');
    },

    parameters: [
        { 
            type: 'string',
            name: 'user', 
            description: 'the iduser to unban', 
            required: true,
        }
    ]
});

easyDJS.commands.add({
    details: {
        commandName: 'test',
        commandDescription: 'a set of test functions'
    },
    
    roles: {
        user: ['test']
    },
    
    executesInDm: false,
    linkedToGuild: false,
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
                    .setCustomId(easyDJS.createCustomID({ 
                        commandName: 'test',
                        action: 'test',
                        executesInDm: true,
                    }))
                    .setLabel("Test")
                    .setStyle('DANGER')
                )

            input.interaction.reply({
                embeds: mainEmbed,
                components: [testButton],
            })
        }

        else if(input.parameters[1][0].value === 'menu') {
            let testButton = new easyDJS.discordJS.MessageActionRow()
                .addComponents(
                    new easyDJS.discordJS.MessageSelectMenu()
                    .setCustomId(easyDJS.createCustomID({ 
                        commandName: 'test',
                        action: 'test2',
                        executesInDm: true,
                    }))
                    .addOptions([
                        { label: '1', value: '1' },
                        { label: '2', value: '2' },
                    ])
                )

            input.interaction.reply({
                embeds: mainEmbed,
                components: [testButton],
            })
        }
    },

    buttonInteraction: function(input:any){
        input.interaction.channel.send({content:'Works!'})
        input.interaction.deferUpdate();
    },

    menuInteraction: function(input:any){
        input.interaction.channel.send({content:'Works!'})
        input.interaction.deferUpdate();
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
        commandName: 'ping',
        commandDescription: 'tests latency'
    },

    executesInDm: true,
    linkedToGuild: false,

    mainFunc: async function(input:any){
        let content:string = `<@${input.interaction.author.id}> Pong and the bot's ping is **${easyDJS.client.ws.ping} ms** round trip, with an **internal speed** speed of **${input.performance.now() - input.speedTest} ms** for this command.`;
        
        input.interaction.reply(content).then(() => {
            if(input.directMessage === false && input.slashCommand === false) input.removeInvoker();
        })
    }
});



easyDJS.commands.loadSlashCommands(true)

easyDJS.start();

//let encoded:string = easyDJS.createCustomID('poo', { pee: 'poo' })
//console.log(encoded, easyDJS.decodeCustomID(encoded))