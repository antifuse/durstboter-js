"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reddit = require("../reddit/reddit");
exports.name = 'subscribe';
exports.permissions = [];
exports.aliases = [];
exports.description = 'Abonniert einen Subreddit.';
function execute(message, args) {
    console.log(args);
    if (!args[0]) {
        message.channel.send('<:wirklich:711126263514792019>');
        return;
    }
    if (message.channel.type === "news")
        return;
    reddit.subscribeChannelToSub(message.channel, args[0]);
}
exports.execute = execute;
//# sourceMappingURL=subscribe.js.map