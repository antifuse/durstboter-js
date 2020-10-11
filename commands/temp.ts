import {Message} from "discord.js";
// @ts-ignore
import si = require("systeminformation");
const cfg = require("../config.json")
import http = require("http");
import {RequestOptions} from "https";

const axios = require("axios").default;

import Discord = require("discord.js");


export const name = 'antitemp'
export const permissions = []
export const aliases = ['durstitemp']
export const description = 'Gets @antifuse#5897\'s current room temperature'

export function execute(message: Message, args: string[]) {
    if (message.content.substr(1) === 'antitemp') {
        axios.get(`http://${cfg.api}/temp`)
            .then((res) => {
                message.channel.send(`Die Temperatur in antifuses Zimmer beträgt ${Math.round((res.data.temp + 273.15) * 10) / 10} K bei einer Luftfeuchtigkeit von ${Math.round(res.data.humid*100)/10000}`)
            })
    } else {
        si.cpuTemperature().then((res)=>{
            message.channel.send(`Durstis Temperatur beträgt ${Math.round((res.main + 273.15) * 10) / 10} K`)
        })
    }
}