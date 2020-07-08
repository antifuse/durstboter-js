import ytdl = require('ytdl-core');
import {Message} from "discord.js";

export const name = 'play'
export const aliases = ['p', 'spiel', 'abspiel', 'wiedergib']
export const permissions = []
export const description = 'Spielt Musik von YouTube'

export function execute(message: Message, args: string[]) {
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
        stream.on("end", () => channel.leave());
    });
}