import reddit = require('../reddit/reddit');
import Discord = require('discord.js');
import {Message, PermissionResolvable, TextChannel, Webhook} from "discord.js";
import {type} from "os";
const cfg = require('../config.json');
const rcfg = require('../reddit/redditcfg.json');
export const name = 'subscribe';
export const permissions: PermissionResolvable[] = [];
export const aliases: string[] = [];
export const description = 'Subscribes a channel to a subreddit feed.'
export function execute(message: Message, args: string[]) {
        if (!args[0]) {
            message.channel.send('<:wirklich:711126263514792019>');
            return;
        }
        if (!rcfg.feeds[args.join(' ')]) {
            message.channel.send('Diesen Feed gibt es nicht.');
            return;
        }
        if(message.channel instanceof TextChannel && message.guild.me.hasPermission('MANAGE_WEBHOOKS')) {
            assignWebhook(message.channel, args.join(' ')).then((hook)=>{
                reddit.subscribeWebhookToFeed(args.join(' '), hook.id);
                message.channel.send(`Der Kanal ${message.channel.toString()} erhält nun Updates für ${args.join(' ')}`);
                message.author.send(`Du kannst dem WebHook ${args.join(' ')} nun einen anderen Namen oder ein neues Profilbild geben.`)
            });
        } else {
            reddit.subscribeChannelToFeed(args.join(' '), message.channel.id);
            message.channel.send(`${message.channel.type === 'dm' ? 'Du erhältst ' : `Der Kanal ${message.channel.name} erhält`} nun Updates für ${args.join(' ')}`);
        }
}

let assignWebhook = async function (channel: TextChannel, feedName: string): Promise<Webhook> {
    let webhook = (await channel.fetchWebhooks()).find((hook)=>{return hook.name === feedName});
    if (!webhook) webhook = await channel.createWebhook(feedName);
    return webhook;
}