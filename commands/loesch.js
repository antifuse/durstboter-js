module.exports = {
    name: 'loesch',
    description: 'Löscht mehrere Nachrichten.',
    execute(message, args) {
        if (!args.length || !message.member.hasPermission('MANAGE_MESSAGES')) return;
        message.channel.bulkDelete(args[0])
            .then(messages => console.log(`Löschte ${messages.size} Nachrichten`))
            .catch();
    }
}