const reddit = require('../reddit/reddit');
const Discord = require('discord.js');
const {submissionsToEmbeds} = require('../reddit/redditParser');
module.exports = {
    name: 'printnewposts',
    permissions: [],
    aliases: [],
    description: 'Prints all new submissions from a subreddit.',
    execute(message, args) {
        message.channel.startTyping();
        reddit.getNewPosts('MIR-feed', args[0]).then((posts) => {
            submissionsToEmbeds(posts)
                .then((embeds => {
                for (let m of embeds.reverse()) {
                    message.channel.send(m);
                }
                message.channel.stopTyping();
                }))
                .catch(()=>{message.channel.stopTyping()})
        })
    }
}
