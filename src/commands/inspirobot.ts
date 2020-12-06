import {Message} from "discord.js";
import * as Axios from "axios"
import log from "../log"
const axios = Axios.default;

export = {
    name: 'inspirobot',
    aliases: ['inspire', 'ibot'],
    description: 'Gets a random quote from Inspirobot',

    execute(message: Message, args: string[]) {
        axios.get('http://inspirobot.me/api?generate=true')
            .then(r=>{
                message.channel.send({files: [r.data]}).then(()=>log.info('Inspiring pic sent.'))
            })
    }
}