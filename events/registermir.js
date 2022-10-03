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
    if (message.content.startsWith(prefix + "register")) {
      const mensaje = message.content.slice(10);
      if (message.guild.ownerId == message.author.id) {
        const embed = new EmbedBuilder()
          .setColor('ff9600')
          .setTitle('Player information')
          .setDescription(`Contact the creator jcordero#9338`)
          .setFooter({ text: 'jcordero#9338 -- Alejandrocd#4130' })
        message.channel.send({ embeds: [embed] })
        return false;
      }

      // if (message.author.username != message.guild.members.cache.get(message.author.id).displayName) {
      //   const embed = new EmbedBuilder()
      //     .setColor('ff9600')
      //     .setTitle('Player information')
      //     .setDescription(`You are already registered use the command !unregister`)
      //     .setFooter({ text: 'Information is updated every day at 03:00 PM Server time.' })
      //   message.channel.send({ embeds: [embed] })
      //   return false;
      // }
      if (mensaje) {
        (async () => {
          try {
            const browser = await puppeteer.launch({
              headless: true,
              args: ['--no-sandbox']
            })
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


            ranking = info[0]
            name = info[5]
            clan = info[6]
            // powerscore = info[7]
            powerscore = clan == '-' ? info[8] : info[7]



            if (clan == '-') {
              const embed = new EmbedBuilder()
                .setColor('ff9600')
                .setTitle('Player information')
                .setDescription(`You cannot register if you are not in a clan`)
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
              return false
            }
            if (server != 'NA54') {
              const embed = new EmbedBuilder()
                .setColor('ff9600')
                .setTitle('Player information')
                .setDescription(`You can only register na54 characters`)
                .setFooter({ text: 'Information is updated every day at 03:00 PM Server time.' })
              message.channel.send({ embeds: [embed] })
              return false
            }
            if (name && clan) {

              let user = message.guild.members.cache.find(member => member.displayName == `[${ranking}] ${name} ${powerscore}`);

              if (user) {
                const embed = new EmbedBuilder()
                  .setColor('ff9600')
                  .setTitle('Player information')
                  .setDescription(`Registered by <@!${user.user.id}>`)
                  .setFooter({ text: 'Information is updated every day at 03:00 PM Server time.' })
                message.channel.send({ embeds: [embed] })

              } else {

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


                //Verificaremos clan
                const sql1 = `SELECT * FROM clanes WHERE name = '${clan}'`
                db.query(sql1, (err, rows) => {
                  if (rows.length != 0) {
                    if (server == 'NA54') {
                      let rol54 = message.guild.roles.cache.find(member => member.name == `NA54`);
                      if (rol54) {
                        message.guild.members.cache.get(message.author.id).roles.add(rol54.id)
                      } else {
                        message.guild.roles.create({ name: 'NA54', color: '#' + (Math.random() * 0xFFFFFF << 0).toString(16) })
                          .then((res => {
                            let rol54 = message.guild.roles.cache.find(member => member.name == `NA54`);
                            message.guild.members.cache.get(message.author.id).roles.add(rol54.id)
                            message.channel.send(`result:\n${res}`)
                          })).catch((err => {
                            message.channel.send(`error:\n${err}`)
                          })) 
                      }
                    }
                    message.channel.send({ embeds: [embed] })
                    let clanObj = message.guild.roles.cache.find(member => member.name == clan);
                    if (clanObj) {
                      //insertar nombre de usuario registrado 
                      message.guild.members.cache.get(message.author.id).setNickname(`[${ranking}] ${name} ${powerscore}`)

                      clan == clan ? message.guild.members.cache.get(message.author.id).roles.add(clanObj.id) : '';

                      //insertar en la base de datos
                      var username = message.author.username;
                      var usernameds = message.author.username + '#' + message.author.discriminator;
                      var displayName = `[${ranking}] ${name} ${powerscore}`;
                      var name2 = name;
                      var powescore = powerscore
                      const sql = `INSERT INTO registry (username,usernameds, displayName, ranking,name,clan,powescore,server, created_at,activo,discorduserid) 
                            VALUES ("${username}", "${usernameds}", "${displayName}","${ranking}","${name2}","${clan}","${powescore}","${server}", NOW(),1,${message.author.id})`

                      db.query(sql, (err, rows) => { /* */ })


                    } else {
                      console.log('No hay rol del clan ');
                      const embed = new EmbedBuilder()
                        .setColor('ff9600')
                        .setTitle('Clan information')
                        .setDescription(`clan without roles in the discord`)
                        .setFooter({ text: 'Information is updated every day at 03:00 PM Server time.' })
                      message.channel.send({ embeds: [embed] })
                      return false
                    }


                  } else {
                    console.log('El clan no esta registrado');
                    const embed = new EmbedBuilder()
                      .setColor('ff9600')
                      .setTitle('Clan information')
                      .setDescription(`clan is not whitelisted`)
                      .setFooter({ text: 'Information is updated every day at 03:00 PM Server time.' })
                    message.channel.send({ embeds: [embed] })
                    return false
                  }
                })


              }

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
      } else {
        const embed = new EmbedBuilder()
          .setColor('ff9600')
          .setTitle('Player information')
          .setDescription(`No results found`)
          .setFooter({ text: 'Information is updated every day at 03:00 PM Server time.' })
        message.channel.send({ embeds: [embed] })
      }
      // console.log(mensaje);
    }
  }
}
