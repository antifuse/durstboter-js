"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.name = 'loesch';
exports.description = 'Löscht mehrere Nachrichten.';
exports.permissions = ['MANAGE_MESSAGES'];
exports.aliases = ['lösch'];
function execute(message, args) {
    if (!args.length || isNaN(parseInt(args[0]))) {
        message.channel.send('<:wirklich:711126263514792019>');
        return;
    }
    message.channel.bulkDelete(parseInt(args[0]) + 1)
        .then(messages => console.log(`Löschte ${messages.size} Nachrichten`));
}
exports.execute = execute;
//# sourceMappingURL=loesch.js.map