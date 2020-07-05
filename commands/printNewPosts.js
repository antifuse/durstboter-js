const reddit = require('../reddit/reddit');
const Discord = require('discord.js');
const rparse = require('../reddit/redditParser');
module.exports = {
    name: 'printnewposts',
    permissions: [],
    aliases: [],
    description: 'Prints all new submissions from a subreddit.',
    execute(message, args) {
        message.channel.startTyping();
        reddit.getNewPosts('test', args[0]).then((posts) => {
            rparse.submissionsToEmbeds(posts)
                .then((embeds) => {
                for (let m of embeds.reverse()) {
                    message.channel.send(m);
                }
                message.channel.stopTyping();
                }, reject  => {
                    message.channel.stopTyping();
                    message.channel.send('<:nundann:724343174256001135>');
                    console.log(reject);
                })
        })
    }
}
