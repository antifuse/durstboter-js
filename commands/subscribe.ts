import {Message, PermissionResolvable} from "discord.js";
import reddit = require("../reddit/reddit");

export const name = 'subscribe';
export const permissions: PermissionResolvable[] = [];
export const aliases: string[] = [];
export const description = 'Abonniert einen Subreddit.'

export function execute(message: Message, args: string[]) {
    console.log(args);
    if (!args[0]) {
        message.channel.send('<:wirklich:711126263514792019>');
        return;
    }
    if (message.channel.type === "news") return;
    reddit.subscribeChannelToSub(message.channel, args[0]);
}