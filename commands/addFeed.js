const reddit = require('../reddit/reddit');
const Discord = require('discord.js');
const cfg = require('../config.json');
const rcfg = require('../reddit/redditcfg.json')
module.exports = {
    name: 'addfeed',
    permissions: ['MANAGE_WEBHOOKS'],
    aliases: [],
    description: 'Adds a subreddit feed.',
    execute(message, args) {
        if (!args[0]) {
            message.channel.send('<:wirklich:711126263514792019>');
            return;
        }
        if (rcfg.feeds[args.join(' ')]) {
            message.channel.send('Dieser Feed existiert bereits!');
        }
        reddit.addFeed(args.join(' '));
        message.channel.send(`Feed ***${args.join(' ')}*** hinzugefügt.`).then(()=> {
            message.channel.send(`Vergiss nicht den Feed mit *${cfg.prefix}subscribe ${args.join(' ')}* zu abonnieren, um Updates zu erhalten!`);
        });
    }
}