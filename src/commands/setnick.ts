import {Message} from "discord.js";
import log from "../log"

export = {
    name: 'setnick',
    description : 'Sets the nickname.',
    permissions: ['MANAGE_NICKNAMES'],

    execute(message: Message, args: string[]) {
        if (!args.length || message.channel.type !== 'text') {
            message.channel.send('<:wirklich:711126263514792019>');
            return;
        }
        let newnick = args.join(' ');
        message.guild.me.setNickname(newnick).then(r => {
            log.info(`Nickname on ${r.guild.name} set to ${r.nickname}`);
            message.channel.send('Ich tat es, Lases!');
        });
    }
    
} 