import Discord = require("discord.js");
let config = require("./config.json");
import fs = require("fs");
import reddit = require("./reddit/reddit");
import rparse = require("./reddit/redditParser");
const {feeds} = require("./reddit/redditcfg.json");
import {Collection, DMChannel, Message, PermissionResolvable, TextBasedChannel, TextChannel} from "discord.js";
import {type} from "os";
import Timeout = NodeJS.Timeout;
const client = new Discord.Client();
const commands: Collection<string, Command> = new Discord.Collection();
const commandFiles = fs.readdirSync(`./commands`).filter(file => file.endsWith('.js'));

interface Command {
    permissions: PermissionResolvable[],
    aliases: string[],
    name: string,
    description: string,
    execute: (message: Message, args: Array<string>) => void
}

let updateFeeds = function(): void {
    for (let feed in require("./reddit/redditcfg.json").feeds) {
        updateFeed(feed);
    }
}

let updateFeed = function(feedName: string): void {
    reddit.getAllNewPosts(feedName).then((posts) => {
        rparse.submissionsToEmbeds(posts)
            .then((embeds) => {
                let channels = require("./reddit/redditcfg.json").feeds[feedName].channels;
                console.log(channels);
                for (let m of embeds) {
                    for (let c of channels) {
                        client.channels.fetch(c).then((channel:TextChannel)=>{
                            channel.send(m);
                        })
                    }
                }
            });
    })
}

for (const file of commandFiles) {
    const command: Command = require(`./commands/${file}`);
    commands.set(command.name, command);
}

// Message on join
client.on('ready',()=> {
    console.log('Yeet!');
    updateFeeds();
    let subchecker: Timeout = setInterval(updateFeeds, 300000);
});

// command handler
client.on('message', message => {
    if(!message.content.startsWith(config.prefix) || message.author.bot) return;
    const args = message.content.slice(config.prefix.length).split(/ +/);
    const commandCall = args.shift().toLowerCase();
    const command: Command = commands.get(commandCall) || commands.find((cmd: Command) => cmd.aliases && cmd.aliases.includes(commandCall));
    if (!command) return;
    try {
        for (let perm of command.permissions) {
            if (!message.member.hasPermission(perm)) {
                message.channel.send('<:wirklich:711126263514792019>');
                return;
            }
        }
        command.execute(message, args);
    } catch (e) {
        console.error(e);
        message.channel.send('<:nundann:724343174256001135>');
    }
});

// DM logger
client.on('message', message => {
    // log message
    console.log(message.content);
    if (!config.logoptout.includes(message.author.id)) fs.appendFile('messages.txt', `${message.author.tag}/${message.channel.id}: ${message.content}\n`,(err)=> {
        if (err) console.log(err);
    });
    if (message.author.id === '235148962103951360' && message.channel.id !== '568569976366301205') message.delete().then(r => console.log(`Carl message deleted: ${r.content}`));
    // log dms to dmlog
    if (message.channel.type === 'dm') {
        client.channels.fetch(config.dmlog)
            .then((channel: DMChannel) => channel.send(`${message.author.tag} : ${message.content}`));
    }
});

// Automatic answers:
let reactions = require('./reactions.json');
client.on('message', message => {
    if (message.author.bot) return;
    for (let r in reactions) {
        if (message.content.toLowerCase().match(r)) message.channel.send(reactions[r]);
    }
});

fs.watch('./reactions.json',(event,name)=> {
    reactions = require('./reactions.json');
});

fs.watch('./config.json',(event,name)=> {
    config = require('./config.json');
});

client.login(config.token).then(r => console.log(r));