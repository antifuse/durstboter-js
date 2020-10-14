import Discord = require("discord.js");
import fs = require("fs");
import {Collection, DMChannel, Message, PermissionResolvable, TextBasedChannel, TextChannel} from "discord.js";
import cron = require("node-cron");


const client = new Discord.Client();
const commands: Collection<string, Command> = new Discord.Collection();
const commandFiles = fs.readdirSync(`./commands`).filter(file => file.endsWith('.js'));
let config = require("./config.json");

interface Command {
    name: string,
    description?: string,
    permissions?: PermissionResolvable[],
    aliases?: string[],
    execute: (message: Message, args: Array<string>) => void
}

for (const file of commandFiles) {
    const command: Command = require(`./commands/${file}`);
    commands.set(command.name, command);
}

// Message on join
client.once('ready',()=> {
    console.log('Yeet!');
});

// command handler
client.on('message', message => {
    if(!message.content.startsWith(config.prefix) || message.author.bot) return;
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
    // log dms to dmlog
    if (message.channel.type === 'dm') {
        client.channels.fetch(config.dmlog)
            .then((channel: DMChannel) => channel.send(`${message.author.tag} : ${message.content}`));
    }
});

// Automatic reactions:
let reactions = require('./reactions.json');
client.on('message', message => {
    if (message.author.bot) return;
    for (let r in reactions) {
        if (message.content.toLowerCase().match(r)) message.channel.send(reactions[r]);
    }
});

client.on('message', async message => {
    if (message.channel.type === 'text' && !message.author.bot) {
        let last2 = (await message.channel.messages.fetch({before: message.id, limit: 2})).array();
        if (!last2[0].author.bot && !last2[1].author.bot && message.content == last2[0].content && message.content == last2[1].content) message.channel.send(message.content);
    }
});

fs.watch('./reactions.json',(event,name)=> {
    fs.readFile("./reactions.json", {encoding: 'utf8'}, (err, data)=>{
        if (!err) reactions = JSON.parse(data);
    });
});

fs.watch('./config.json',(event,name)=> {
    fs.readFile("./config.json", {encoding: 'utf8'}, (err, data)=>{
        if (!err) config = JSON.parse(data);
    });
});

client.login(config.token)
    .then(() => console.log("Logging in!"));

cron.schedule('0 20 * * *', ()=>{
    config["broadcast-channels"].forEach((id: string)=>{
        client.channels.fetch(id).then((channel)=>{
            if (channel instanceof TextChannel || channel instanceof DMChannel) channel.send('TAGESSCHAU O\'CLOCK!');
        })
    })
})
