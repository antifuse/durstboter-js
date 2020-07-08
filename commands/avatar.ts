import Discord = require('discord.js');
import {Message} from "discord.js";

export const name = 'avatar'
export const description = 'Gibt das Profilbild eines Nutzers aus.'
export const aliases = ['ava', 'pfp', 'picture', 'profilbild', 'bild']
export const permissions = []

export function execute(message: Message, args: string[]) {
    let fetchUsers = async function (message: Message, args: string[]) {
        let mentioned = message.mentions.members.array();
        if (mentioned.length < 1) {
            for (let arg of args) {
                console.log(arg);
                let user = undefined;
                let fetched = await message.guild.members.fetch({query: arg, limit: 1});
                user = fetched.array()[0];
                if (user) mentioned.push(user);
            }
        }
        return mentioned;
    }
    let mentionedUsers = fetchUsers(message, args).then(r => {
        if (r.length < 1) {
            message.channel.send(
                new Discord.MessageEmbed()
                    .setColor(message.member.displayHexColor)
                    .setTitle(`Avatar von ${message.author.tag}`)
                    .setImage(message.author.avatarURL({size: 4096}))
            ).catch(reason => console.log(reason));
            return;
        }
        for (let user of r) {
            message.channel.send(
                new Discord.MessageEmbed()
                    .setColor(user.displayHexColor)
                    .setTitle(`Avatar von ${user.user.tag}`)
                    .setImage(user.user.avatarURL({size: 4096}))
            ).catch(reason => console.log(reason));
        }
    });
}