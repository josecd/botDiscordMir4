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
        if (message.content.startsWith(prefix + "search")) {
            const mensaje = message.content.slice(8)
            console.log(mensaje);
            (async () => {
              try {
                const browser = await puppeteer.launch();
                const page = await browser.newPage();
                const response = await page.goto(`https://forum.mir4global.com/rank?ranktype=1&worldgroupid=12&worldid=509&classtype=0&searchname=${mensaje}&globalSearch=1`);
                const body = await response.text();
                const { window: { document } } = new jsdom.JSDOM(body);
                let ranking = ''
                let name = ''
                let clan = ''
                let powerscore = ''
                let info = []
        
                let serversection = ''
                let server = ''
        
                document.querySelectorAll('.list_article span').forEach(async (element) => {
                  info.push(element.textContent)
                });
        
                document.querySelectorAll('[id^=worldgroup_name]').forEach(async (element) => {
                  serversection = element.textContent
                });
        
                document.querySelectorAll('[id^=world_name]').forEach(async (element) => {
                  server = element.textContent.slice(3)
                });
        
                document.querySelectorAll('[style="background-image: url]').forEach(async (element) => {
                  console.log(element);
                });
                console.log(info);
                console.log(name, clan, powerscore);
        
                ranking = info[0]
                name = info[5]
                clan = info[6]
                // powerscore = info[7]
                powerscore = clan == '-' ? info[8] : info[7]
        
                if (name) {
                  const embed = new EmbedBuilder()
                    .setColor('ff9600')
                    .setTitle('Player information')
                    .setFooter({ text: 'Information is updated every day at 03:00 PM Server time.' })
                    .addFields([
                      {
                        name: 'Ranking',
                        value: ranking,
                        inline: true
                      },
                      {
                        name: 'Name',
                        value: name,
                        inline: true
                      },
                      {
                        name: 'Clan',
                        value: clan,
                        inline: true
                      },
                      {
                        name: 'Power Score',
                        value: powerscore + ' k',
                        inline: true
                      },
        
                      {
                        name: 'Server',
                        value: serversection + ' ' + server,
                        inline: true
                      },
        
                    ])
                  message.channel.send({ embeds: [embed] })
                } else {
                  const embed = new EmbedBuilder()
                    .setColor('ff9600')
                    .setTitle('Player information')
                    .setDescription(`No results found`)
                    .setFooter({ text: 'Information is updated every day at 03:00 PM Server time.' })
                  message.channel.send({ embeds: [embed] })
        
                }
        
        
        
                await browser.close();
              } catch (error) {
                console.error(error);
              }
            })();
          }
    }
}