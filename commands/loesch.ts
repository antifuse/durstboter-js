import {Message} from "discord.js";

export const name = 'loesch'
export const description = 'Löscht mehrere Nachrichten.'
export const permissions = ['MANAGE_MESSAGES']
export const aliases = ['lösch']

export function execute(message: Message, args: string[]) {
    if (!args.length || isNaN(parseInt(args[0]))) {
        message.channel.send('<:wirklich:711126263514792019>');
        return;
    }
    message.channel.bulkDelete(parseInt(args[0]) + 1)
        .then(messages => console.log(`Löschte ${messages.size} Nachrichten`));
}