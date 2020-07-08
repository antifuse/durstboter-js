"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Catbox = require("catbox.moe");
exports.name = 'upload';
exports.description = 'Eine Datei auf Catbox.moe hochladen';
exports.aliases = ['up', 'hoch', 'ladhoch', 'hochlad'];
exports.permissions = [];
function execute(message, args) {
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
                a = m.attachments.array()[0].url;
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
        }
        else {
            message.channel.startTyping();
            cb.upload(a).then(link => {
                message.channel.send(link);
                message.channel.stopTyping();
            });
        }
    });
}
exports.execute = execute;
//# sourceMappingURL=upload.js.map