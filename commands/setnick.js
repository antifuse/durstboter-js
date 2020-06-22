module.exports = {
    name: 'setnick',
    description: 'Sets the nickname.',
    permissions: ['MANAGE_NICKNAMES'],
    execute(message, args) {
        if (!args.length || !message.guild) {
            message.channel.send('<:wirklich:711126263514792019>');
            return;
        }
        let newnick = args.join(' ');
        message.guild.me.setNickname(newnick).then(r => {
            console.log(`Nickname set to ${r.nickname}`);
            message.channel.send('Ich tat es, Lases!');
        });
    }
}