const Discord = require('discord.js');
module.exports = {
    name: 'stop',
    aliases: ['stopp','halt','leave','geh'],
    permissions: [],
    description: 'Stoppt den aktuellen Stream.',
    execute(message, args) {
        if (!message.guild.voice.channel) {
            message.channel.send('<:wirklich:711126263514792019>');
            return;
        }
        message.guild.voice.channel.leave();
        message.channel.send('<:plueschwein:665993499660779578>');
    }
}