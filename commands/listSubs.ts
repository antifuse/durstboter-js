import {redditconfig} from "../reddit/reddit";
import {Message} from "discord.js";

export const name = 'listsubs'
export const permissions = []
export const aliases = []
export const description = 'Lists the subreddits in a subreddit feed.'
export function execute(message: Message,args: string[]) {
    const rcfg: redditconfig = require('../reddit/redditcfg.json');
    let subs = rcfg.subs.filter((sub) => {return sub.channels.includes(message.channel.id)});
    if (!subs[0]) message.channel.send(`Der Kanal ${message.channel.toString()} hat keine Subreddits abonniert.`);
    else message.channel.send(`Der Kanal ${message.channel.toString()} hat folgende Subreddits abonniert: \n${subs.map((sub) => {
        return sub.name
    }).join('\n')}`);
}