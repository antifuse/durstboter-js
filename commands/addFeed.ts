import reddit = require('../reddit/reddit');
import Discord = require('discord.js');
import cfg = require('../config.json');
import rcfg = require('../reddit/redditcfg.json');
import {Message} from "discord.js";
export const name: string = 'addfeed';
export const permissions: string[] = ['MANAGE_WEBHOOKS'];
export const aliases: string[] = [];
export const description: string = 'Adds a subreddit feed.';
export function execute(message: Message, args: string[]): void {
        if (!args[0]) {
            message.channel.send('<:wirklich:711126263514792019>');
            return;
        }
        if (rcfg.feeds[args.join(' ')]) {
            message.channel.send('Dieser Feed existiert bereits!');
        }
        reddit.addFeed(args.join(' '));
        message.channel.send(`Feed ***${args.join(' ')}*** hinzugefügt.`).then(()=> {
            message.channel.send(`Vergiss nicht den Feed mit *${cfg.prefix}subscribe ${args.join(' ')}* zu abonnieren, um Updates zu erhalten!`);
        });
}
