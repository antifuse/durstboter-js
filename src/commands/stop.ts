import {Message} from "discord.js";
import log from "../log"

export = {
    name: 'stop',
    aliases: ['stopp', 'halt', 'leave', 'geh'],
    description: 'Stoppt den aktuellen Stream.',

    execute(message: Message, args: string[]) {
        if (message.channel.type !== 'text' || !message.guild.voice || !message.guild.voice.channel.members.has(message.author.id)) {
            message.channel.send('<:wirklich:711126263514792019>');
            return;
        }
        message.guild.voice.channel.leave();
        message.channel.send('<:plueschwein:665993499660779578>');
    }
}