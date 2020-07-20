import {Message} from "discord.js";

export const name = 'ping'
export const description = 'Pöng.'
export const permissions = []

export function execute(message: Message, args: string[]) {
    message.channel.send('<:glatt:721807880264613943>');
}