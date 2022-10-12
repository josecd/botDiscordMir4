const fs = require('fs');
const prefix = "!";
const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder } = require('discord.js')
const fetch = require("node-fetch");
const cheerio = require("cheerio");

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
    if (message.content.startsWith(prefix + "piloto")) {
    // if (message.content.startsWith(prefix + "register")) {
      // if (message.content.startsWith(prefix + "register1" || message.content.startsWith(prefix + "Register1"))) {
      const sql = `SELECT * FROM registrypilot where username='${message.author.username}' AND activo='1'`
      db.query(sql, async (err, rows) => {
        if (rows.length != 0) {
          const embed = new EmbedBuilder()
            .setColor('ff9600')
            .setTitle('Player information')
            .setDescription(`You are already registered use the command !unregister`)
            .setFooter({ text: 'Information is updated every day at 03:00 PM Server time.' })
          message.channel.send({ embeds: [embed] })
          return false;
        }

        const mensaje = message.content.slice(8);
        if (message.guild.ownerId == message.author.id) {
          const embed = new EmbedBuilder()
            .setColor('ff9600')
            .setTitle('Player information')
            .setDescription(`Contact the creator Alejandrocd#4130`)
            .setFooter({ text: 'Alejandrocd#4130' })
          message.channel.send({ embeds: [embed] })
          return false;
        }


        const getRawData = (URL) => {
          return fetch(URL)
            .then((response) => response.text())
            .then((data) => {
              return data;
            });
        };
        const URL = `https://forum.mir4global.com/rank?ranktype=1&worldgroupid=12&worldid=509&classtype=0&searchname=${mensaje}&globalSearch=1`;
        const encodedURI = encodeURI(URL);
        const getCricketWorldCupsList = async () => {
          const cricketWorldCupRawData = await getRawData(encodedURI);
          const parsedSampleData = await cheerio.load(cricketWorldCupRawData);
          const name = parsedSampleData('.user_name').text()
          const sql1 = `SELECT * FROM registrypilot WHERE name = '${mensaje}' AND activo='1' `
          db.query(sql1, (err, rows) => {
            if (rows.length != 0) {
              const embed = new EmbedBuilder()
                .setColor('ff9600')
                .setTitle('Player information')
                .setDescription(`The user has already been registered ${rows[0].usernameds}`)
                .setFooter({ text: 'Information is updated every day at 03:00 PM Server time.' })
              message.channel.send({ embeds: [embed] })
              return false;
            }

            if (name) {

              const server = `${parsedSampleData('[id^=worldgroup_name]').text().slice(3)} ${parsedSampleData('[id^=world_name]').text().slice(3)}`.replace(/ /g, "")
              const ranking = parsedSampleData('.rank_num .num').text().replace(/ /g, "")
              const clan = parsedSampleData("tbody tr").children().children()[2].children[0].data ? parsedSampleData("tbody tr").children().children()[2].children[0].data : ''
              const ps = parsedSampleData('.list_article .text_right span').text().replace(/ /g, "")

              if (clan) {

                //Verificaremos clan
                const sql1 = `SELECT * FROM clanes WHERE name = '${clan}'`
                db.query(sql1, (err, rows) => {
                  if (rows.length != 0) {

                    if (server == 'NA54') {
                    } else {
                      const embed = new EmbedBuilder()
                        .setColor('ff9600')
                        .setTitle('Player information')
                        .setDescription(`You can only register na54 characters`)
                        .setFooter({ text: 'Information is updated every day at 03:00 PM Server time.' })
                      message.channel.send({ embeds: [embed] })
                      return false;
                    }

                    let clanObj = message.guild.roles.cache.find(member => member.name == clan);
                    if (clanObj) {
                      //insertar nombre de usuario registrado 
                      message.guild.members.cache.get(message.author.id).setNickname(`Pilot-${name} ${ps}`)
                      clan == clan ? message.guild.members.cache.get(message.author.id).roles.add(clanObj.id) : '';
                      //rol de na54
                      message.guild.members.cache.get(message.author.id).roles.add('1017844427441578084')
                      //rol de piloto
                      message.guild.members.cache.get(message.author.id).roles.add('1029203524254437466')


                      //insertar en la base de datos
                      var username = message.author.username;
                      var usernameds = message.author.username + '#' + message.author.discriminator;
                      var displayName = `[${ranking}] ${name} ${ps}`;
                      var name2 = name;
                      const sql = `INSERT INTO registrypilot (username,usernameds, displayName, ranking,name,clan,powescore,server, created_at,activo,discorduserid) 
                                            VALUES ("${username}", "${usernameds}", "${displayName}","${ranking}","${name2}","${clan}","${ps}","${server}", NOW(),1,${message.author.id})`
                      db.query(sql, (err, rows) => { /* */ })

                      const embed = new EmbedBuilder()
                        .setColor('ff9600')
                        .setTitle('Player information registered')
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
                            value: ps + ' k',
                            inline: true
                          },

                          {
                            name: 'Server',
                            value: server,
                            inline: true
                          },

                        ])
                      message.channel.send({ embeds: [embed] })

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
                    const embed = new EmbedBuilder()
                      .setColor('ff9600')
                      .setTitle('Clan information')
                      .setDescription(`clan ~~${clan}~~  is not whitelisted`)
                      .setFooter({ text: 'Information is updated every day at 03:00 PM Server time.' })
                    message.channel.send({ embeds: [embed] })
                    return false
                  }
                })


              } else {
                const embed = new EmbedBuilder()
                  .setColor('ff9600')
                  .setTitle('Player information')
                  .setDescription(`You don't have a clan`)
                  .setFooter({ text: 'Information is updated every day at 03:00 PM Server time.' })
                message.channel.send({ embeds: [embed] })
                return false;
              }



            } else {
              const embed = new EmbedBuilder()
                .setColor('ff9600')
                .setTitle('Player information')
                .setDescription(`No results found`)
                .setFooter({ text: 'Information is updated every day at 03:00 PM Server time.' })
              message.channel.send({ embeds: [embed] })
            }
          })


        };
        await getCricketWorldCupsList()

      })
    }
  }



}


