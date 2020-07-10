import {Message} from "discord.js";
import https = require("https");
import {RequestOptions} from "https";
import Discord = require("discord.js");


export const name = 'inspirobot'
export const permissions = []
export const aliases = ['inspire','ibot']
export const description = 'Gets a random quote from Inspirobot'
export function execute(message: Message,args: string[]) {
    let options: RequestOptions = {
        host: 'inspirobot.me',
        path: '/api?generate=true',
        protocol: 'https:',
    }
    https.get(options,(res)=>{
        res.setEncoding('utf8')
        let output = '';
        res.on('data',(data)=>{
            message.channel.send({files: [data]});
        })
    })
}