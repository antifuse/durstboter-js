"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.name = 'stop';
exports.aliases = ['stopp', 'halt', 'leave', 'geh'];
exports.permissions = [];
exports.description = 'Stoppt den aktuellen Stream.';
function execute(message, args) {
    if (message.channel.type !== 'text' || !message.guild.voice || !message.guild.voice.channel.members.has(message.author.id)) {
        message.channel.send('<:wirklich:711126263514792019>');
        return;
    }
    message.guild.voice.channel.leave();
    message.channel.send('<:plueschwein:665993499660779578>');
}
exports.execute = execute;
//# sourceMappingURL=stop.js.map