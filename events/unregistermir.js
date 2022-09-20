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

      if (message.guild.ownerId == message.author.id) {
        const embed = new EmbedBuilder()
          .setColor('ff9600')
          .setTitle('Player information')
          .setDescription(`Contact the creator jcordero#9338`)
          .setFooter({ text: 'jcordero#9338 -- Alejandrocd#4130' })
        message.channel.send({ embeds: [embed] })
        return false;
      }

      const sql2 = `UPDATE registry SET activo=0 WHERE usernameds='${message.author.username + '#' + message.author.discriminator}'`
      db.query(sql2, (err, rows) => {})
      const sql1 = `SELECT * FROM clanes`
      db.query(sql1, (err, rows) => {
        const valores = message.guild.roles.cache
        const valores2 = rows

        const comparador = (valores, valores2) => {
          let responseArray = [];
          let lis = valores2.filter(i => {
            let obj = valores.find(e => {
              if (e.name == i.name) {
                let copyArray2Element = i;
                copyArray2Element.name = e.name;
                responseArray.push(copyArray2Element);
                return true;
              }
            });
          });
          let responseArrayOnlyIds = responseArray.map(e => e.name);
          return responseArrayOnlyIds;
        }
        const clanInfo = comparador(valores, valores2)
        clanInfo.map(async (element) => {
          let rolClan = message.guild.roles.cache.find(member => member.name == element);
          message.guild.members.cache.get(message.author.id).roles.remove(rolClan.id)
        });
        let rol54 = message.guild.roles.cache.find(member => member.name == `NA54`);
        rol54 ? message.guild.members.cache.get(message.author.id).roles.remove(rol54.id) : ''
        message.guild.members.cache.get(message.author.id).setNickname(message.author.username)

      })
    }
  }
}