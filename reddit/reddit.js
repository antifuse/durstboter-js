const Discord = require('discord.js');
const snoowrap = require('snoowrap');
const rcfg = require('./redditcfg.json');
const fs = require('fs');
const r = new snoowrap({userAgent:'Durstboter',clientId:rcfg.clientId, clientSecret: rcfg.clientSecret, refreshToken: rcfg.refreshToken});


module.exports = {
    updateCfg() {
        fs.writeFileSync('reddit/redditcfg.json',JSON.stringify(rcfg,null,2));
    },
    async getNewPosts(feedName, subName) {
        if(!feedName || !subName) return [];
        if(!rcfg.feeds[feedName]) {
            rcfg.feeds[feedName] = {subs: [], channel: ''};
        }
        let sub = r.getSubreddit(subName);
        let entry = rcfg.feeds[feedName].subs.filter((subreddit) => {return subreddit.name === subName})[0];
        if (!entry) {
            entry = {name:subName, last:''};
            rcfg.feeds[feedName].subs.push(entry);
        }
        let allposts = await sub.getNew({limit:20});
        let newposts = [];
        for (let submission of allposts) {
            if (submission.id === entry.last) break;
            newposts.push(submission);
        }
        if (newposts.length === 0) return undefined;
        entry.last = newposts[0].id;
        this.updateCfg();
        return newposts;
    },
    async getAllNewPosts(feedName) {
        if (!feedName) return [];
        if (!rcfg.feeds[feedName]) {
            rcfg.feeds[feedName] = {subs: [], channel: ''};
        }
        let allposts = [];
        for (let sub of rcfg.feeds[feedName].subs) {
            let posts = await this.getNewPosts(feedName, sub.name);
            allposts = posts ? allposts.concat(posts) : allposts;
            console.log(`Checked ${sub.name}, ${posts ? posts.length : 0} new posts`)
        }
        allposts.sort((a,b)=>{
            return (a.created > b.created) ? 1 : (a.created < b.created ? -1 : 0);
        });
        this.updateCfg();
        return allposts;
    },
    addFeed(feedName,channelID) {
        if(rcfg.feeds[feedName]) return;
        rcfg.feeds[feedName] = {subs: [], channels: []};
        if (channelID) rcfg.feeds[feedName].channels.push(channelID);
        this.updateCfg();
    },
    addSubToFeed(feedName, subName) {
        if(!rcfg.feeds[feedName]) this.addFeed(feedName);
        if(rcfg.feeds[feedName].subs.filter((sub)=>{return sub.name === subName}).length !== 0) return;
        rcfg.feeds[feedName].subs.push({name: subName, last: ''});
        this.updateCfg();
    },
    removeSubFromFeed(feedName, subName) {
        rcfg.feeds[feedName].subs = rcfg.feeds[feedName].subs.filter((entry) => {return !(entry.name === subName)});
        this.updateCfg();
    },
    subscribeChannelToFeed(feedName, channelID) {
        if(rcfg.feeds[feedName]) rcfg.feeds[feedName].channels.push(channelID);
        this.updateCfg();
    }
}