"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.name = 'setnick';
exports.description = 'Sets the nickname.';
exports.permissions = ['MANAGE_NICKNAMES'];
function execute(message, args) {
    if (!args.length || message.channel.type !== 'text') {
        message.channel.send('<:wirklich:711126263514792019>');
        return;
    }
    let newnick = args.join(' ');
    message.guild.me.setNickname(newnick).then(r => {
        console.log(`Nickname set to ${r.nickname}`);
        message.channel.send('Ich tat es, Lases!');
    });
}
exports.execute = execute;
//# sourceMappingURL=setnick.js.map