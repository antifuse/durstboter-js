module.exports = {
    name: 'loesch',
    description: 'Löscht mehrere Nachrichten.',
    permissions: ['MANAGE_MESSAGES'],
    aliases: ['lösch'],
    execute(message, args) {
        if (!args.length) return;
        message.channel.bulkDelete(args[0]-(-1))
            .then(messages => console.log(`Löschte ${messages.size} Nachrichten`))
            .catch();
    }
}