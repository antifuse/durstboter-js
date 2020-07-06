import snoowrap = require('snoowrap');
import fs = require('fs');
const rcfg = require("./redditcfg.json");
import {Submission} from "snoowrap";
import {Client, TextChannel, Webhook} from "discord.js";
import {submissionsToEmbeds} from "./redditParser";

const r = new snoowrap({
    userAgent: 'Durstboter',
    clientId: rcfg.clientId,
    clientSecret: rcfg.clientSecret,
    refreshToken: rcfg.refreshToken
});

let updateCfg = function () {
    fs.writeFileSync('reddit/redditcfg.json', JSON.stringify(rcfg, null, 2));
}

export async function getNewPosts(feedName: string, subName: string): Promise<Submission[]> {
    if (feedName === 'test') {
        rcfg.feeds['test'] = {subs: [], channels: [], hooks: []}
    }
    if (!feedName || !subName) return [];
    if (!rcfg.feeds[feedName]) {
        rcfg.feeds[feedName] = {subs: [], channels: [], hooks: []};
    }
    let sub = r.getSubreddit(subName);
    let entry = rcfg.feeds[feedName].subs.find((subreddit: {name: string, last: string}) => {
        return subreddit.name === subName;
    });
    if (!entry) {
        entry = {name: subName, last: ''};
        rcfg.feeds[feedName].subs.push(entry);
    } else if (entry.last === '') {
        let last2: Submission[] = await sub.getNew({limit: 2});
        if (last2[1]) entry.last = last2[1].id;
    }
    let allposts = await sub.getNew({limit: 20});
    let newposts = [];
    for (let submission of allposts) {
        if (submission.id === entry.last) break;
        newposts.push(submission);
    }
    if (newposts.length !== 0) entry.last = newposts[0].id;
    updateCfg();
    return newposts;
}

export async function getAllNewPosts(feedName: string): Promise<Submission[]> {
    if (!feedName) return [];
    if (!rcfg.feeds[feedName]) {
        rcfg.feeds[feedName] = {subs: [], channels: [], hooks: []};
    }
    let allposts = [];
    console.log(`Checking subs for ${feedName}...`)
    for (let sub of rcfg.feeds[feedName].subs) {
        let posts = await getNewPosts(feedName, sub.name);
        allposts = posts ? allposts.concat(posts) : allposts;
        console.log(`Checked ${sub.name}, ${posts ? posts.length : 0} new posts`)
    }
    console.log('Done.')
    allposts.sort((a, b) => {
        return (a.created > b.created) ? 1 : (a.created < b.created ? -1 : 0);
    });
    updateCfg();
    return allposts;
}

export function addFeed(feedName: string, channelID?: string): void {
    if (rcfg.feeds[feedName]) return;
    rcfg.feeds[feedName] = {subs: [], channels: [], hooks: []};
    if (channelID) rcfg.feeds[feedName].channels.push(channelID);
    updateCfg();
}

export function addSubToFeed(feedName: string, subName: string): void {
    if (!rcfg.feeds[feedName]) addFeed(feedName);
    if (rcfg.feeds[feedName].subs.filter((sub) => {
        return sub.name === subName
    }).length !== 0) return;
    rcfg.feeds[feedName].subs.push({name: subName, last: ''});
    updateCfg();
}

export function removeSubFromFeed(feedName: string, subName: string): void {
    rcfg.feeds[feedName].subs = rcfg.feeds[feedName].subs.filter((entry) => {
        return !(entry.name === subName)
    });
    updateCfg();
}

export function subscribeChannelToFeed(feedName: string, channelID: string): void {
    if (rcfg.feeds[feedName]) rcfg.feeds[feedName].channels.push(channelID);
    updateCfg();
}

export function subscribeWebhookToFeed(feedName: string, hookID: string): void {
    if (rcfg.feeds[feedName]) rcfg.feeds[feedName].hooks.push(hookID);
    updateCfg();
}

export function updateFeeds(client: Client) {
    for (let feed in rcfg.feeds) {
        updateFeed(feed, client);
    }
}

export function updateFeed(feedName: string, client: Client): void {
    getAllNewPosts(feedName).then((posts) => {
        submissionsToEmbeds(posts)
            .then((embeds) => {
                console.log(`Converted ${posts.length} submissions. Sending...`)
                let channels: string[] = rcfg.feeds[feedName].channels;
                let hooks: string[] = rcfg.feeds[feedName].hooks;
                channels.forEach((channel)=>console.log(`Sending to ${channel}`));
                hooks.forEach((hook)=>console.log(`Sending via ${hook}`))
                for (let m of embeds) {
                    for (let c of channels) {
                        client.channels.fetch(c).then((channel:TextChannel)=>{
                            channel.send(m);
                        })
                    }
                    for (let h of hooks) {
                        client.fetchWebhook(h).then((hook: Webhook)=>{
                            hook.send(m);
                        })
                    }
                }
            });
    })
}