import Discord = require('discord.js');
import {Submission, Subreddit} from "snoowrap";
import {MessageEmbed} from "discord.js";

export async function submissionToEmbed (submission: Submission) {
    // @ts-ignore
    let sub: Subreddit = await submission.subreddit.fetch();
    let embed: MessageEmbed = new Discord.MessageEmbed()
        .setAuthor(submission.subreddit_name_prefixed, sub.community_icon, 'https://reddit.com/' + submission.subreddit_name_prefixed)
        .setTitle(submission.title.length > 256 ? submission.title.substr(0,253) + '...' : submission.title)
        .setColor('#' + submission.subreddit.primary_color)
        .setDescription(submission.is_self ?(submission.selftext.length > 2048 ? submission.selftext.substr(0, 2045) + '...' : submission.selftext) : '')
        .setFooter('u/' + submission.author.name)
        .setTimestamp(submission.created_utc * 1000)
        .setURL('http://reddit.com' + submission.permalink);
    if(!submission.is_self) {
        if(submission.url.match(/^http.*(png|gif|mp4|jpg|jpeg)/)) embed.setImage(submission.url);
        else embed.setDescription(submission.url)
    }
    console.log(submission.url);
    return embed;
}

export async function submissionsToEmbeds (posts: Submission[]) {
    let embeds: MessageEmbed[] = [];
    for (let post of posts) {
        let embed = await this.submissionToEmbed(post);
        embeds.push(embed);
    }
    return embeds;
}
