import {Message, MessageEmbed} from "discord.js";
//@ts-ignore
import Mediawiki = require("nodemw");
import Discord = require("discord.js");
const client: Mediawiki = new Mediawiki({
    server: 'en.wikipedia.org',
    path: '/w'
})

export = {
    name: 'wikipedia',
    description: 'Sucht auf Wikipedia.',
    aliases: ['wiki','wsearch'],

    execute: function (message: Message, args: string[]) {
        client.search(args[0]?args.join(' '):'Rick Astley', (error, data)=>{
            console.log(data[0]);
            client.api.call({action: 'query', prop: 'extracts', exsentences: 7, exlimit: 1, explaintext: 1, exintro: 1, pageids: data[0].pageid, format: 'json'}, (error,info, next) => {
                message.channel.send(new MessageEmbed({title: info.pages[data[0].pageid].title, description: info.pages[data[0].pageid].extract, footer:{text: 'From Wikipedia, the free encyclopedia that anyone can edit'}}));
            })
        })
    }
}
