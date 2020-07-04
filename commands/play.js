const Discord = require('discord.js');
const ytdl = require('ytdl-core');
module.exports = {
    name: 'play',
    aliases: ['p','spiel','abspiel','wiedergib'],
    permissions: [],
    description: 'Spielt Musik von YouTube',
    execute(message, args) {
        if (message.channel.type !== 'text') {
            message.channel.send('<:wirklich:711126263514792019>');
            return;
        }
        const channel = message.member.voice.channel;
        if (!channel) {
            message.channel.send('<:wirklich:711126263514792019>');
            return;
        }
        channel.join().then(vcon => {
            const stream = ytdl(ytdl.validateURL(args[0]) ? args[0] : 'https://youtube.com/watch?v=dQw4w9WgXcQ', {filter: "audioonly"});
            const dispatch = vcon.play(stream);
            dispatch.on('end', () => channel.leave());
        });
    }
}