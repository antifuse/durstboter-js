module.exports = {
    name: 'sendmsg',
    description: 'Sends a message to a channel or user.',
    permissions: [],
    aliases: ['sendmessage'],
    execute(message,args) {
        if (message.author.id !== '233228684159483906' || args.length < 1) {
            message.channel.send('<:wirklich:711126263514792019>');
            return;
        }
        let content = args[1] || '_ _';
        message.client.channels.fetch(args[0]).then(channel => {
            if (!(channel.type === 'text' || channel.type === 'dm')) {
                message.channel.send('<:wirklich:711126263514792019>');
                return;
            }
           channel.send(content);
        });
    }
}