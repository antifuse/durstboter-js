import {Message} from "discord.js";
const axios = require("axios").default;


export const name = 'inspirobot'
export const permissions = []
export const aliases = ['inspire', 'ibot']
export const description = 'Gets a random quote from Inspirobot'

export function execute(message: Message, args: string[]) {
    axios.get('http://inspirobot.me/api?generate=true')
        .then(r=>{
            message.channel.send({files: [r.data]}).then(()=>console.log('Inspiring pic sent.'))
        })
}