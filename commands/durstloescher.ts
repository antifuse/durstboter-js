import {Message} from "discord.js";

const axios = require("axios").default

export = {
    name: 'durstlöscher',
    aliases: ['durstloescher', 'loescher', 'dursti', 'löscher'],
    description: 'Gets a random Durstlöscher',

    execute(message: Message, args: string[]) {
        axios.get('http://localhost/durstloescher/random').then(r => {
            message.channel.send({content: `Durstlöscher von ${r.data.poster}`, files: [r.data.pic]})
                .then(() => {
                    console.log(`Durstlöscher pic ${r.data.counter} sent to ${message.channel.toString()}`)
                })
        })
    }
}
