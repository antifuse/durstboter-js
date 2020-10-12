import {Message, DMChannel} from "discord.js";

export = {
    name: 'loesch',
    description: 'Löscht mehrere Nachrichten.',
    permissions: ['MANAGE_MESSAGES'],
    aliases: ['lösch'],

    execute(message: Message, args: string[]) {
        if (!args.length || isNaN(parseInt(args[0])) || message.channel instanceof DMChannel) {
            message.channel.send('<:wirklich:711126263514792019>');
            return;
        }
        message.channel.bulkDelete(parseInt(args[0]) + 1)
            .then(messages => console.log(`Löschte ${messages.size} Nachrichten`));
    }
}