import {Message} from "discord.js";

export = {
    name: 'ping',
    description: 'Pöng.',

    execute(message: Message, args: string[]) {
        message.channel.send('<:glatt:721807880264613943>');
    }
}