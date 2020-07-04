const Discord = require('discord.js');
module.exports = {
    async submissionToEmbed (submission) {
        let sub = await submission.subreddit.fetch();
        let embed = new Discord.MessageEmbed()
            .setAuthor(submission.subreddit_name_prefixed, sub.community_icon, 'https://reddit.com/' + submission.subreddit_name_prefixed)
            .setTitle(submission.title)
            .setColor('#' + submission.subreddit.primary_color)
            .setDescription(submission.is_self ?(submission.selftext.length > 2048 ? submission.selftext.substr(0, 2045) + '...' : submission.selftext) : '')
            .setFooter('u/' + submission.author.name)
            .setTimestamp(submission.created_utc * 1000)
            .setURL('http://reddit.com' + submission.permalink);
        if(!submission.is_self && submission.url.match(/^http*/)) {
            embed.setImage(submission.url);
            console.log(submission.url);
        }
        return embed;
    },
    async submissionsToEmbeds (posts) {
        let embeds = [];
        for (let post of posts) {
            let embed = await this.submissionToEmbed(post);
            embeds.push(embed);
        }
        return embeds;
    }
}