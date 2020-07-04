module.exports = {
    name: 'listsubs',
    permissions: [],
    aliases: [],
    description: 'Lists the subreddits in a subreddit feed.',
    execute(message,args) {
        if (!args[0]) {
            message.channel.send('<:wirklich:711126263514792019>');
            return;
        }
        const rcfg = require('../reddit/redditcfg.json');
        const {prefix} = require('../config.json')
        if(!rcfg.feeds[args.join(' ')]) {
            message.channel.send(`Dieser Feed existiert nicht! Füge ihn hinzu mit *${prefix}addfeed ${args.join(' ')}*`);
            return;
        }
        message.channel.send(`Aktuelle Subreddits in ***${args.join(' ')}***: \n${rcfg.feeds[args.join(' ')].subs.map(sub => sub.name).join('\n')}`);
    }
}