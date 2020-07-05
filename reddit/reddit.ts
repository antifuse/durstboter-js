import snoowrap = require('snoowrap');
import fs = require('fs');
import rcfg = require("./redditcfg.json");
import {Submission} from "snoowrap";

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
        rcfg.feeds['test'] = {subs: [], channels: []}
    }
    if (!feedName || !subName) return [];
    if (!rcfg.feeds[feedName]) {
        rcfg.feeds[feedName] = {subs: [], channels: []};
    }
    let sub = r.getSubreddit(subName);
    let entry = rcfg.feeds[feedName].subs.filter((subreddit) => {
        return subreddit.name === subName
    })[0];
    if (!entry) {
        entry = {name: subName, last: ''};
        rcfg.feeds[feedName].subs.push(entry);
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
        rcfg.feeds[feedName] = {subs: [], channels: []};
    }
    let allposts = [];
    for (let sub of rcfg.feeds[feedName].subs) {
        let posts = await this.getNewPosts(feedName, sub.name);
        allposts = posts ? allposts.concat(posts) : allposts;
        console.log(`Checked ${sub.name}, ${posts ? posts.length : 0} new posts`)
    }
    allposts.sort((a, b) => {
        return (a.created > b.created) ? 1 : (a.created < b.created ? -1 : 0);
    });
    updateCfg();
    return allposts;
}

export function addFeed(feedName: string, channelID?: string): void {
    if (rcfg.feeds[feedName]) return;
    rcfg.feeds[feedName] = {subs: [], channels: []};
    if (channelID) rcfg.feeds[feedName].channels.push(channelID);
    updateCfg();
}

export function addSubToFeed(feedName: string, subName: string): void {
    if (!rcfg.feeds[feedName]) this.addFeed(feedName);
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
