import Discord = require("discord.js");
import fs = require("fs");
import { Collection, DMChannel, Message, PermissionResolvable, TextBasedChannel, TextChannel, Channel } from "discord.js";
//@ts-ignore
import Steamapi = require("steamapi");
import cron = require("node-cron");
import * as winston from "winston";
import log from "./log";

const client = new Discord.Client();
const commands: Collection<string, Command> = new Discord.Collection();
const commandFiles = fs.readdirSync(`./build/commands`).filter(file => file.endsWith('.js'));
let config = JSON.parse(fs.readFileSync("./config.json", { encoding: 'utf8' }));
const steam = new Steamapi(config.steamauth);
log.info("Loaded config.");

interface Command {
    name: string,
    description?: string,
    permissions?: PermissionResolvable[],
    aliases?: string[],
    execute: (message: Message, args: Array<string>) => void,
    log: (message: string) => void
}

for (const file of commandFiles) {
    const command: Command = require(`./commands/${file}`);
    command.log = (message) => log.info(message);
    commands.set(command.name, command);
}

log.info(`Loaded ${commands.size} commands`);

// Message on join
client.once('ready', () => {
    log.info('Ready.');
});

// command handler
client.on('message', message => {
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;
    const args = message.content.slice(config.prefix.length).split(/ +/);
    const commandCall = args.shift().toLowerCase();
    const command: Command = commands.get(commandCall) || commands.find((cmd: Command) => cmd.aliases && cmd.aliases.includes(commandCall));
    if (!command) return;
    try {
        if (command.permissions) {
            for (let perm of command.permissions) {
                if (!message.member.hasPermission(perm)) {
                    message.channel.send('<:wirklich:711126263514792019>');
                    return;
                }
            }
        }
        command.execute(message, args);
    } catch (e) {
        log.error(e);
        message.channel.send('<:nundann:724343174256001135>');
    }
});

// DM logger
client.on('message', message => {
    // log message
    if (!config.logoptout.includes(message.author.id)) {
        log.info(`${message.author.tag}/${message.channel.id}: ${message.content}`);
        fs.appendFile('messages.txt', `${message.author.tag}/${message.channel.id}: ${message.content}\n`, (err) => {
            if (err) log.error(err);
        });
    }
    // log dms to dmlog
    if (message.channel.type === 'dm') {
        client.channels.fetch(config.dmlog)
            .then((channel: Channel) => { if (channel instanceof DMChannel) channel.send(`${message.author.tag} : ${message.content}`) });
    }
});

let reactions: any;
// Automatic reactions:
fs.readFile("./reactions.json", { encoding: 'utf8' }, (err, data) => {
    if (!err) reactions = JSON.parse(data);
});
log.info("Loaded reactions.")
client.on('message', message => {
    if (message.author.bot) return;
    for (let r in reactions) {
        if (message.content.toLowerCase().match(r)) message.channel.send(reactions[r]);
    }
});

// Message quadrupling
client.on('message', async message => {
    if (message.channel.type === 'text' && !message.author.bot) {
        let last2 = (await message.channel.messages.fetch({ before: message.id, limit: 2 })).array();
        if (!last2[0].author.bot && !last2[1].author.bot && message.content == last2[0].content && message.content == last2[1].content && !last2[0].author.equals(last2[1].author) && !message.author.equals(last2[0].author) && !message.author.equals(last2[1].author)) message.channel.send(message.content);
    }
});

// Watch reaction & config files
fs.watch('./reactions.json', (event, name) => {
    fs.readFile("./reactions.json", { encoding: 'utf8' }, (err, data) => {
        if (!err) reactions = JSON.parse(data);
    });
    log.info("Reloaded reactions.")
});

fs.watch('./config.json', (event, name) => {
    fs.readFile("./config.json", { encoding: 'utf8' }, (err, data) => {
        if (!err) config = JSON.parse(data);
    });
    log.info("Reloaded config.")
});

// hold my bot token, i'm going in!
client.login(config.token);

//cron.schedule('0 20 * * *', () => {
//    config["broadcast-channels"].forEach((id: string) => {
//        client.channels.fetch(id).then((channel) => {
//            if (channel instanceof TextChannel || channel instanceof DMChannel) channel.send('TAGESSCHAU O\'CLOCK!');
//        })
//    })
//})
let semarcplaying = "";
cron.schedule('*/5 * * * *', ()=>{
    steam.getUserSummary('76561198062163607').then((summary:any)=>{
        if (summary.gameExtraInfo && summary.gameExtraInfo != semarcplaying) {
            semarcplaying = summary.gameextrainfo;
            config["broadcast-channels"].forEach((id:string)=>{
                client.channels.fetch(id).then((channel) => {
                    if (channel instanceof TextChannel || channel instanceof DMChannel) channel.send(`Semarc spielt **${summary.gameExtraInfo}**`);
                })
            })
        }
    })
})
