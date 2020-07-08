import {Message} from "discord.js";
import Catbox = require("catbox.moe");

export const name = 'upload'
export const description = 'Eine Datei auf Catbox.moe hochladen'
export const aliases = ['up', 'hoch', 'ladhoch', 'hochlad']
export const permissions = []

export function execute(message: Message, args: string[]) {
    const cb = new Catbox();
    if (args[0]) {
        message.channel.startTyping();
        cb.upload(args[0]).then(link => {
            message.channel.send(link);
            message.channel.stopTyping();
        });
        return;
    }
    message.channel.messages.fetch()
        .then(messages => {
            let a = undefined;
            for (let m of messages.values()) {
                if (m.attachments.array()[0]) {
                    a = m.attachments.array()[0].url
                    break;
                }
                if (m.embeds.length) {
                    if (m.embeds[0].type === 'image') {
                        a = m.embeds[0].image.url;
                        break;
                    }
                    if (m.embeds[0].type === 'video') {
                        a = m.embeds[0].video.url;
                        break;
                    }
                }
            }
            if (!a) {
                message.channel.send('<:wirklich:711126263514792019>');
            } else {
                message.channel.startTyping();
                cb.upload(a).then(link => {
                    message.channel.send(link);
                    message.channel.stopTyping();
                });
            }
        });
}