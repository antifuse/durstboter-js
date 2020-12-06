import {DMChannel, Message, TextChannel} from "discord.js";
import log from "../log"

export = {
    name: 'sendmsg',
    description: 'Sends a message to a channel or user.',
    aliases: ['sendmessage'],

    execute(message: Message, args: string[]) {
        if (message.author.id !== '233228684159483906' || args.length < 1) {
            message.channel.send('<:wirklich:711126263514792019>');
            return;
        }
        let content = args[1] || '_ _';
        message.client.channels.fetch(args[0]).then(channel => {
            if (channel instanceof TextChannel || channel instanceof DMChannel) {
                channel.send(content).then((mess)=>log.info(`Sent message ${mess.content} to ${mess.channel.id}`))
            } else {
                message.channel.send('<:wirklich:711126263514792019>');
            }
        });
    }
}