const Discord = require('discord.js');
const {prefix,token,dmlog} = require('./config.json');
const fs = require('fs');

const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync(`./commands`).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

// Message on join
client.on('ready',()=> {
    console.log('Yeet!');
});

// command handler
client.on('message', message => {
    if(!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
    if (!client.commands.has(command)) return;
    try {
        client.commands.get(command).execute(message, args);
    } catch (e) {
        console.error(e);
        message.channel.send('<:nundann:724343174256001135>');
    }
});

// DM logger
client.on('message', message => {
    // log message
    console.log(message.content);
    fs.appendFile('messages.txt', `${message.author.tag}/${message.channel.id}: ${message.content}\n`,(err)=> {
        if (err) console.log(err);
    });
    // log dms to dmlog
    if (message.channel.type === 'dm') {
        client.channels.fetch(dmlog)
            .then(channel => channel.send(`${message.author.tag} : ${message.content}`));
    }
});

client.login(token).then(r => console.log(r));