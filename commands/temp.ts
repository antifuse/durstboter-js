import {Message} from "discord.js";
import http = require("http");
import {RequestOptions} from "https";

const axios = require("axios").default;

import Discord = require("discord.js");


export const name = 'antitemp'
export const permissions = []
export const aliases = []
export const description = 'Gets @antifuse#5897\'s current room temperature'

export function execute(message: Message, args: string[]) {
    axios.get('http://localhost/temp')
        .then((res) => {
            message.channel.send(`Die Temperatur in antifuses Zimmer beträgt ${Math.round((res.data.temp + 273.15) * 10) / 10} K`)
        })
}