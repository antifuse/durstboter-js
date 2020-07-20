import {Message} from "discord.js";

const axios = require("axios").default;

export const name = 'durstlöscher'
export const permissions = []
export const aliases = ['durstloescher', 'loescher', 'dursti', 'löscher']
export const description = 'Gets a random Durstlöscher'

export function execute(message: Message, args: string[]) {
    axios.get('http://localhost/durstloescher/random').then(r => {
        message.channel.send({content: `Durstlöscher von ${r.data.poster}`, files: [r.data.pic]})
            .then(() => {
                console.log(`Durstlöscher pic ${r.data.counter} sent to ${message.channel.toString()}`)
            })
    })
}