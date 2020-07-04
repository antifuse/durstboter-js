const reddit = require('../reddit/reddit');
const Discord = require('discord.js');
const cfg = require('../config.json');
const rcfg = require('../reddit/redditcfg.json');
module.exports = {
    name: 'subscribe',
    permissions: ['MANAGE_WEBHOOKS'],
    aliases: [],
    description: 'Subscribes a channel to a subreddit feed.',
    execute(message, args) {
        if (!args[0]) {
            message.channel.send('<:wirklich:711126263514792019>');
            return;
        }
        if (!rcfg.feeds[args.join(' ')]) {
            message.channel.send('Diesen Feed gibt es nicht.');
            return;
        }
        reddit.subscribeChannelToFeed(args.join(' '), message.channel.id);
        message.channel.send(`Der Kanal ${message.channel.toString()} erhält nun Updates für ${args.join(' ')}`)
    }
}