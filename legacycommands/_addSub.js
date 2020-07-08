const reddit = require('./_reddit');

const Discord = require('discord.js');
const cfg = require('../config.json')
module.exports = {
    name: 'addsub',
    permissions: ['MANAGE_WEBHOOKS'],
    aliases: [],
    description: 'Adds a subreddit to an existing feed.',
    execute(message, args) {
        if (!args[1]) {
            message.channel.send('<:wirklich:711126263514792019>');
            return;
        }
        reddit.addSubToFeed(args.slice(1,args.length).join(' '), args[0]);
        message.channel.send(`Subreddit ***${args[0]}*** zu Feed ***${args.slice(1,args.length).join(' ')}*** hinzugefügt.`).then(()=> {
            const rcfg = require('../reddit/redditcfg.json');
            message.channel.send(`Aktuelle Subreddits im Feed: \n${rcfg.feeds[args.slice(1,args.length).join(' ')].subs.map(sub => sub.name).join('\n')}`);
        });
    }
}