export interface redditconfig {
    subs: {name: string, channels: string[], hooks: string[], last: string}[],
    webhooks: any,
    clientId: string,
    clientSecret: string,
    refreshToken: string
}

import snoowrap = require('snoowrap');
import {
    Channel,
    Client,
    Collection, DMChannel,
    PartialTextBasedChannel,
    PartialTextBasedChannelFields, TextBasedChannel,
    TextChannel, Webhook
} from "discord.js";
import {submissionToEmbed} from "./redditParser";
import {SubmissionStream} from "snoostorm";
import Submission from "snoowrap/dist/objects/Submission";
let rcfg: redditconfig = require("./redditcfg.json");
import fs = require("fs");
const r = new snoowrap({
    userAgent: 'Durstboter',
    clientId: rcfg.clientId,
    clientSecret: rcfg.clientSecret,
    refreshToken: rcfg.refreshToken
});
let streams: Collection<string,SubmissionStream> = new Collection<string, SubmissionStream>();
let updateCfg = function () {
    fs.writeFileSync('reddit/redditcfg.json', JSON.stringify(rcfg, null, 2));
}
export function init(client: Client) {
    rcfg = require("./redditcfg.json");
    for (let sub of rcfg.subs) {
        let stream: SubmissionStream = new SubmissionStream(r,{subreddit: sub.name, limit: 1, pollTime: 20000});
        stream.on('item', (submission)=>{sendToFeeds(submission, client)});
        streams.set(sub.name, stream);
    }
}

let sendToFeeds = async function(submission: Submission, client: Client) {
    if (submission.id === rcfg.subs.find((sub)=>{return sub.name === submission.subreddit_name_prefixed.slice(2)}).last) return;
    rcfg.subs.find((sub)=>{return sub.name === submission.subreddit_name_prefixed.slice(2)}).last = submission.id;
    let embed = await submissionToEmbed(submission);
    let entry = rcfg.subs.find((sub)=>{return sub.name === submission.subreddit_name_prefixed.slice(2)});
    for (let channelID of entry.channels) {
        let channel: Channel = await client.channels.fetch(channelID);
        if (channel instanceof (TextChannel || DMChannel)) {
            channel.send(embed).then(r => console.log(`Sent post to ${r.channel.toString()}`));
        }
    }
    for (let hookID of entry.hooks) {
        let hook: Webhook = await client.fetchWebhook(hookID);
        hook.send(embed).then(r => console.log(`Sent post to ${r.channel.toString()}`));
    }
    updateCfg();
}

export async function subscribeChannelToSub(channel: TextChannel | DMChannel, subname: string) {
    let entry = rcfg.subs.find((sub) => {
        return sub.name === subname;
    });
    if (!entry) {
        entry = {name: subname, channels: [], hooks: [], last: ''}
        rcfg.subs.push(entry);
        let stream: SubmissionStream = new SubmissionStream(r,{subreddit: entry.name, limit: 1, pollTime: 20000});
        stream.on('item', (submission)=>{sendToFeeds(submission, channel.client)});
        streams.set(entry.name, stream);
    }

    if (channel instanceof TextChannel && channel.guild.me.hasPermission('MANAGE_WEBHOOKS')) {
        let hook: Webhook;
        if (rcfg.webhooks[channel.id]) hook = await channel.client.fetchWebhook(rcfg.webhooks[channel.id]);
        else {
            hook = await channel.createWebhook('Reddit Feed');
            rcfg.webhooks[channel.id] = hook.id;
        }
        if (!entry.hooks.includes(hook.id)){
            entry.hooks.push(hook.id);
            channel.send(`Der Kanal ${channel.toString()} erhält nun Updates für **r/${subname}**`);
        }
        else unsubscribeChannelFromSub(channel, subname);
    } else {
        if (!entry.channels.includes(channel.id)) {
            entry.channels.push(channel.id);
            channel.send(`${channel.type === 'dm' ? 'Du erhältst' : `Der Kanal ${channel.toString()} erhält`} nun Updates für **r/${subname}**`);
        }
        else unsubscribeChannelFromSub(channel, subname);
    }
    updateCfg();
}

export function unsubscribeChannelFromSub(channel: TextChannel | DMChannel, sub: string) {
    let entry: { name: string, channels: string[], hooks: string[] } = rcfg.subs.find((subreddit) => {
        return subreddit.name === sub
    });
    let index = entry.channels.indexOf(channel.id, 0);
    if (index > -1) entry.channels.splice(index, 1);
    if (channel.type === 'text' && channel.guild.me.hasPermission("MANAGE_WEBHOOKS")) {
        index = entry.hooks.indexOf(rcfg.webhooks[channel.id],0);
        if (index > -1) entry.hooks.splice(index, 1);
    }
    channel.send(`Dieser Kanal erhält nun keine Updates für **r/${sub}** mehr.`);
    updateCfg();
}



