import {Message} from "discord.js";
import log from "../log"

export = {
    name: 'ping',
    description: 'Pöng.',

    execute(message: Message, args: string[]) {
        message.channel.send('<:glatt:721807880264613943>').then(()=>log.info("Wurde gepingt, wirklichte zurück."));
    }
}