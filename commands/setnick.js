module.exports = {
    name: 'setnick',
    description: 'Sets the nickname.',
    execute(message, args) {
        if (!args.length || !message.guild) {
            message.channel.send('<:wirklich:711126263514792019>');
            return;
        }
        let newnick = args.join(' ');
        message.guild.me.setNickname(newnick);
        console.log(`Nickname set to ${newnick}`);
    }
}