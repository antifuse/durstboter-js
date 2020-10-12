import {Message} from "discord.js";
const axios = require("axios").default;

export = {
    name: 'inspirobot',
    aliases: ['inspire', 'ibot'],
    description: 'Gets a random quote from Inspirobot',

    execute(message: Message, args: string[]) {
        axios.get('http://inspirobot.me/api?generate=true')
            .then(r=>{
                message.channel.send({files: [r.data]}).then(()=>console.log('Inspiring pic sent.'))
            })
    }
}