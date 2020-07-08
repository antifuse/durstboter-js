import {Message} from "discord.js";

export const name = 'stop'
export const aliases = ['stopp', 'halt', 'leave', 'geh']
export const permissions = []
export const description = 'Stoppt den aktuellen Stream.'

export function execute(message: Message, args: string[]) {
    if (message.channel.type !== 'text' || !message.guild.voice || !message.guild.voice.channel.members.has(message.author.id)) {
        message.channel.send('<:wirklich:711126263514792019>');
        return;
    }
    message.guild.voice.channel.leave();
    message.channel.send('<:plueschwein:665993499660779578>');
}