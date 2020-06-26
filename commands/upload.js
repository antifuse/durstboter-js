module.exports = {
    name: 'upload',
    description: 'Eine Datei auf Catbox.moe hochladen',
    aliases: ['up','hoch','ladhoch','hochlad'],
    permissions: [],
    execute(message, args) {
        const catbox = require('catbox.moe');
        const cb = new catbox();
        message.channel.messages.fetch()
            .then(messages => {
                let a = undefined;
                for (let m of messages.values()) {
                    if (m.attachments.array()[0]) {
                        a = m.attachments.array()[0].url
                        break;
                    }
                    if (m.embeds[0] && (m.embeds[0].type === 'image' || m.embeds[0].type === 'video')) {
                        a = m.embeds[0].url
                        break;
                    }
                }
                message.channel.startTyping();
                cb.upload(a).then(link => {
                    message.channel.send(link);
                    message.channel.stopTyping();
                });
            });
    }
}