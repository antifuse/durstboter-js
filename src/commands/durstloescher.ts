import {Message} from "discord.js";
import * as Axios from "axios"
import log from "../log"
const axios = Axios.default;

export = {
    name: 'durstlöscher',
    aliases: ['durstloescher', 'loescher', 'dursti', 'löscher'],
    description: 'Gets a random Durstlöscher',

    execute(message: Message, args: string[]) {
        axios.get('http://localhost/durstloescher/random').then(r => {
            message.channel.send({content: `Durstlöscher von ${r.data.poster}`, files: [r.data.pic]})
                .then(() => {
                    log.info(`Durstlöscher pic ${r.data.counter} sent to ${message.channel.toString()}`)
                })
        })
    }
}
