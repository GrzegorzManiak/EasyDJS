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


easyDJS.commands.loadSlashCommands(true)

easyDJS.start();