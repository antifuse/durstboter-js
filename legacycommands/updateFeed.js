const reddit = require('./_reddit');
const rcfg = require('../reddit/redditcfg.json');
const Discord = require('discord.js');
const rparse = require('../reddit/redditParser');
const {submissionsToEmbeds} = require('../reddit/redditParser');
module.exports = {
    name: 'updatefeed',
    permissions: ['MANAGE_WEBHOOKS'],
    aliases: [],
    description: 'Prints all new submissions from a subreddit.',
    execute(message, args) {
        if(!args[0]) {
            message.channel.send('<:wirklich:711126263514792019>');
            return;
        }
        message.channel.startTyping();
        console.log(args.join(' '));
        reddit.getAllNewPosts(args.join(' ')).then((posts) => {
            console.log(posts);
            rparse.submissionsToEmbeds(posts)
                .then((embeds) => {
                    let channels = rcfg.feeds[args.join(' ')].channels;
                    console.log(channels);
                    for (let m of embeds) {
                        for (let c of channels) {
                            message.client.channels.fetch(c).then((channel)=>{
                                channel.send(m);
                            })
                        }
                    }
                    message.channel.stopTyping();
                });
        })
    }
}