const fs = require('fs');
const prefix = "!";

const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder } = require('discord.js')
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages
  ]
});

const puppeteer = require('puppeteer');
const jsdom = require('jsdom');
var db = require('../database')

module.exports = {
    name: 'messageCreate',
    async execute(message) {
        if (message.content.startsWith(prefix + "unregister")) {
            const mensaje = message.content.slice(10)
            console.log(mensaje);
            let rol54 = message.guild.roles.cache.find(member => member.name == `NA54`);
            let rol76 = message.guild.roles.cache.find(member => member.name == `NA76`);
            let clanDTMÇG = message.guild.roles.cache.find(member => member.name == `DTM Ç G`);
            let clanDTMInfra = message.guild.roles.cache.find(member => member.name == `DTM Infra`);
            let clanDTMLaOrden = message.guild.roles.cache.find(member => member.name == `DTM LaOrden`);
            let clanDTMCGALO = message.guild.roles.cache.find(member => member.name == `DTM CG ALO`);
            let clanDTMCGcomilla = message.guild.roles.cache.find(member => member.name == 'DTM CG´');
            let clanDTMCGWINX = message.guild.roles.cache.find(member => member.name == `DTM CG WINX`);
            let clanDTMCGØrigen = message.guild.roles.cache.find(member => member.name == `DTM CGØrigen`);
            let clanDTMCG = message.guild.roles.cache.find(member => member.name == `D T M CG`);
        
            message.guild.members.cache.get(message.author.id).setNickname(message.author.username)
            rol54 ? message.guild.members.cache.get(message.author.id).roles.remove(rol54.id) : ''
            rol76 ? message.guild.members.cache.get(message.author.id).roles.remove(rol76.id) : ''
            clanDTMÇG ? message.guild.members.cache.get(message.author.id).roles.remove(clanDTMÇG.id) : ''
            clanDTMInfra ? message.guild.members.cache.get(message.author.id).roles.remove(clanDTMInfra.id) : ''
            clanDTMLaOrden ? message.guild.members.cache.get(message.author.id).roles.remove(clanDTMLaOrden.id) : ''
            clanDTMCGALO ? message.guild.members.cache.get(message.author.id).roles.remove(clanDTMCGALO.id) : ''
            clanDTMCGcomilla ? message.guild.members.cache.get(message.author.id).roles.remove(clanDTMCGcomilla.id) : ''
            clanDTMCGWINX ? message.guild.members.cache.get(message.author.id).roles.remove(clanDTMCGWINX.id) : ''
            clanDTMCGØrigen ? message.guild.members.cache.get(message.author.id).roles.remove(clanDTMCGØrigen.id) : ''
            clanDTMCG ? message.guild.members.cache.get(message.author.id).roles.remove(clanDTMCG.id) : ''
        
          }
    }
}