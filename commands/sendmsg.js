"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
exports.name = 'sendmsg';
exports.description = 'Sends a message to a channel or user.';
exports.permissions = [];
exports.aliases = ['sendmessage'];
function execute(message, args) {
    if (message.author.id !== '233228684159483906' || args.length < 1) {
        message.channel.send('<:wirklich:711126263514792019>');
        return;
    }
    let content = args[1] || '_ _';
    message.client.channels.fetch(args[0]).then(channel => {
        if (channel instanceof discord_js_1.TextChannel || channel instanceof discord_js_1.DMChannel) {
            channel.send(content);
        }
        else {
            message.channel.send('<:wirklich:711126263514792019>');
        }
    });
}
exports.execute = execute;
//# sourceMappingURL=sendmsg.js.map