const prefix = "!";

const express = require('express');
const app = express();
const port = 3000;


const { Client, GatewayIntentBits,EmbedBuilder ,GuildMember } = require('discord.js')
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
  ]
});

const puppeteer = require('puppeteer');
const jsdom = require('jsdom');

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on("messageCreate", (message) => {
  if (message.content.startsWith(prefix + "register")) {
    const mensaje = message.content.slice(10);
    // console.log(mensaje);
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
        let img = ''
        let serversection =''
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

        ranking = info[0]
        name = info[5]
        clan = info[6]
        powerscore = info[7]

        if (name) {

          let user = message.guild.members.cache.find(member => member.displayName == `[${ranking}] ${name} ${powerscore}`);
          if (user) {
            const embed = new EmbedBuilder()
            .setColor('ff9600')
            .setTitle('Player information')
            .setDescription(`Registered by <@!${user.user.id}>`)
            .setFooter({text:'Information is updated every day at 03:00 PM Server time.'})
            message.channel.send({ embeds: [embed] })

          }else{

            message.guild.members.cache.get(message.author.id).setNickname(`[${ranking}] ${name} ${powerscore}`)
            const embed = new EmbedBuilder()
              .setColor('ff9600')
              .setTitle('Player information')
              .setFooter({text:'Information is updated every day at 03:00 PM Server time.'})
              .addFields([
                {
                  name:'Ranking',
                  value:ranking,
                  inline:true
                },
                {
                  name:'Name',
                  value:name,
                  inline:true
                },
                {
                  name:'Clan',
                  value:clan,
                  inline:true
                },
                {
                  name:'Power Score',
                  value:powerscore + ' k',
                  inline:true
                },
  
                {
                  name:'Server',
                  value:serversection + ' '+ server,
                  inline:true
                },
  
              ])
              message.channel.send({ embeds: [embed] })
              let rol54 = message.guild.roles.cache.find(member => member.name == `NA54`);
              let rol57 = message.guild.roles.cache.find(member => member.name == `NA57`);

              if (server == 'NA54') {
                message.guild.members.cache.get(message.author.id).roles.add(rol54.id)
              }else if(server == 'NA76'){
                message.guild.members.cache.get(message.author.id).roles.add(rol57.id)
              }
          }

        }

        await browser.close();
      } catch (error) {
        console.error(error);
      }
    })();
  }
})

client.on("messageCreate", (message) => {
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

        let serversection =''
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


        ranking = info[0]
        name = info[5]
        clan = info[6]
        powerscore = info[7]


        if (name) {
          const embed = new EmbedBuilder()
          .setColor('ff9600')
          .setTitle('Player information')
          .setFooter({text:'Information is updated every day at 03:00 PM Server time.'})
          .addFields([
            {
              name:'Ranking',
              value:ranking,
              inline:true
            },
            {
              name:'Name',
              value:name,
              inline:true
            },
            {
              name:'Clan',
              value:clan,
              inline:true
            },
            {
              name:'Power Score',
              value:powerscore + ' k',
              inline:true
            },
  
            {
              name:'Server',
              value:serversection + ' '+ server,
              inline:true
            },
  
          ])
          message.channel.send({ embeds: [embed] })
        }else{
          const embed = new EmbedBuilder()
          .setColor('ff9600')
          .setTitle('Player information')
          .setDescription(`No results found`)
          .setFooter({text:'Information is updated every day at 03:00 PM Server time.'})
          message.channel.send({ embeds: [embed] })

        }



        await browser.close();
      } catch (error) {
        console.error(error);
      }
    })();
  }

});










client.login(require('./token.json').token);
