"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reddit = require("./_reddit");
const cfg = require("../config.json");
const rcfg = require("../reddit/redditcfg.json");
exports.name = 'addfeed';
exports.permissions = ['MANAGE_WEBHOOKS'];
exports.aliases = [];
exports.description = 'Adds a subreddit feed.';
function execute(message, args) {
    if (!args[0]) {
        message.channel.send('<:wirklich:711126263514792019>');
        return;
    }
    if (rcfg.feeds[args.join(' ')]) {
        message.channel.send('Dieser Feed existiert bereits!');
    }
    reddit.addFeed(args.join(' '));
    message.channel.send(`Feed ***${args.join(' ')}*** hinzugefügt.`).then(() => {
        message.channel.send(`Vergiss nicht den Feed mit *${cfg.prefix}subscribe ${args.join(' ')}* zu abonnieren, um Updates zu erhalten!`);
    });
}
exports.execute = execute;
//# sourceMappingURL=_addFeed.js.map