"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.name = 'listsubs';
exports.permissions = [];
exports.aliases = [];
exports.description = 'Lists the subreddits in a subreddit feed.';
function execute(message, args) {
    const rcfg = require('../reddit/redditcfg.json');
    let subs = rcfg.subs.filter((sub) => { return sub.channels.includes(message.channel.id); });
    if (!subs[0])
        message.channel.send(`Der Kanal ${message.channel.toString()} hat keine Subreddits abonniert.`);
    else
        message.channel.send(`Der Kanal ${message.channel.toString()} hat folgende Subreddits abonniert: \n${subs.map((sub) => {
            return sub.name;
        }).join('\n')}`);
}
exports.execute = execute;
//# sourceMappingURL=listSubs.js.map