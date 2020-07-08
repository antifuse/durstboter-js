"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const snoowrap = require("snoowrap");
const discord_js_1 = require("discord.js");
const redditParser_1 = require("./redditParser");
const snoostorm_1 = require("snoostorm");
let rcfg = require("./redditcfg.json");
const fs = require("fs");
const r = new snoowrap({
    userAgent: 'Durstboter',
    clientId: rcfg.clientId,
    clientSecret: rcfg.clientSecret,
    refreshToken: rcfg.refreshToken
});
let streams = new discord_js_1.Collection();
let updateCfg = function () {
    fs.writeFileSync('reddit/redditcfg.json', JSON.stringify(rcfg, null, 2));
};
function init(client) {
    rcfg = require("./redditcfg.json");
    for (let sub of rcfg.subs) {
        let stream = new snoostorm_1.SubmissionStream(r, { subreddit: sub.name, limit: 1, pollTime: 20000 });
        stream.on('item', (submission) => { sendToFeeds(submission, client); });
        streams.set(sub.name, stream);
    }
}
exports.init = init;
let sendToFeeds = async function (submission, client) {
    if (submission.id === rcfg.subs.find((sub) => { return sub.name === submission.subreddit_name_prefixed.slice(2); }).last)
        return;
    rcfg.subs.find((sub) => { return sub.name === submission.subreddit_name_prefixed.slice(2); }).last = submission.id;
    let embed = await redditParser_1.submissionToEmbed(submission);
    let entry = rcfg.subs.find((sub) => { return sub.name === submission.subreddit_name_prefixed.slice(2); });
    for (let channelID of entry.channels) {
        let channel = await client.channels.fetch(channelID);
        if (channel instanceof (discord_js_1.TextChannel || discord_js_1.DMChannel)) {
            channel.send(embed).then(r => console.log(`Sent post to ${r.channel.toString()}`));
        }
    }
    for (let hookID of entry.hooks) {
        let hook = await client.fetchWebhook(hookID);
        hook.send(embed).then(r => console.log(`Sent post to ${r.channel.toString()}`));
    }
    updateCfg();
};
async function subscribeChannelToSub(channel, subname) {
    let entry = rcfg.subs.find((sub) => {
        return sub.name === subname;
    });
    if (!entry) {
        entry = { name: subname, channels: [], hooks: [], last: '' };
        rcfg.subs.push(entry);
        let stream = new snoostorm_1.SubmissionStream(r, { subreddit: entry.name, limit: 1, pollTime: 20000 });
        stream.on('item', (submission) => { sendToFeeds(submission, channel.client); });
        streams.set(entry.name, stream);
    }
    if (channel instanceof discord_js_1.TextChannel && channel.guild.me.hasPermission('MANAGE_WEBHOOKS')) {
        let hook;
        if (rcfg.webhooks[channel.id])
            hook = await channel.client.fetchWebhook(rcfg.webhooks[channel.id]);
        else {
            hook = await channel.createWebhook('Reddit Feed');
            rcfg.webhooks[channel.id] = hook.id;
        }
        if (!entry.hooks.includes(hook.id)) {
            entry.hooks.push(hook.id);
            channel.send(`Der Kanal ${channel.toString()} erhält nun Updates für **r/${subname}**`);
        }
        else
            unsubscribeChannelFromSub(channel, subname);
    }
    else {
        if (!entry.channels.includes(channel.id)) {
            entry.channels.push(channel.id);
            channel.send(`${channel.type === 'dm' ? 'Du erhältst' : `Der Kanal ${channel.toString()} erhält`} nun Updates für **r/${subname}**`);
        }
        else
            unsubscribeChannelFromSub(channel, subname);
    }
    updateCfg();
}
exports.subscribeChannelToSub = subscribeChannelToSub;
function unsubscribeChannelFromSub(channel, sub) {
    let entry = rcfg.subs.find((subreddit) => {
        return subreddit.name === sub;
    });
    let index = entry.channels.indexOf(channel.id, 0);
    if (index > -1)
        entry.channels.splice(index, 1);
    if (channel.type === 'text' && channel.guild.me.hasPermission("MANAGE_WEBHOOKS")) {
        index = entry.hooks.indexOf(rcfg.webhooks[channel.id], 0);
        if (index > -1)
            entry.hooks.splice(index, 1);
    }
    channel.send(`Dieser Kanal erhält nun keine Updates für **r/${sub}** mehr.`);
    updateCfg();
}
exports.unsubscribeChannelFromSub = unsubscribeChannelFromSub;
//# sourceMappingURL=reddit.js.map