"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = require("discord.js");
exports.name = 'avatar';
exports.description = 'Gibt das Profilbild eines Nutzers aus.';
exports.aliases = ['ava', 'pfp', 'picture', 'profilbild', 'bild'];
exports.permissions = [];
function execute(message, args) {
    let fetchUsers = async function (message, args) {
        let mentioned = message.mentions.members.array();
        if (mentioned.length < 1) {
            for (let arg of args) {
                console.log(arg);
                let user = undefined;
                let fetched = await message.guild.members.fetch({ query: arg, limit: 1 });
                user = fetched.array()[0];
                if (user)
                    mentioned.push(user);
            }
        }
        return mentioned;
    };
    let mentionedUsers = fetchUsers(message, args).then(r => {
        if (r.length < 1) {
            message.channel.send(new Discord.MessageEmbed()
                .setColor(message.member.displayHexColor)
                .setTitle(`Avatar von ${message.author.tag}`)
                .setImage(message.author.avatarURL({ size: 4096 }))).catch(reason => console.log(reason));
            return;
        }
        for (let user of r) {
            message.channel.send(new Discord.MessageEmbed()
                .setColor(user.displayHexColor)
                .setTitle(`Avatar von ${user.user.tag}`)
                .setImage(user.user.avatarURL({ size: 4096 }))).catch(reason => console.log(reason));
        }
    });
}
exports.execute = execute;
//# sourceMappingURL=avatar.js.map