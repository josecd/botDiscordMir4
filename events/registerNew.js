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
    if (message.content.startsWith(prefix + "updateptn")) {
      const mensaje = message.content.slice(11);

      if (message.guild.ownerId == message.author.id) {
        const embed = new EmbedBuilder()
          .setColor('ff9600')
          .setTitle('Player information')
          .setDescription(`Contact the creator jcordero#9338`)
          .setFooter({ text: 'jcordero#9338 -- Alejandrocd#4130' })
        message.channel.send({ embeds: [embed] })
        return false;
      }

      await message.guild.members.fetch() //cache all members in the server
      let role = message.guild.roles.cache.find(role => role.name === "NA54") //the role to check
      let totalMembers = role.members.map(m => m) // array of user IDs who have the role

      const sqlte = `SELECT * FROM registry where activo='0'`

      db.query(sqlte, async (err, rows) => {

        const asyncRes = await Promise.all(rows.map(async (i) => {
          const getRawData = (URL) => {
            return fetch(URL)
              .then((response) => response.text())
              .then((data) => {
                return data;
              });
          };

          // URL for data
          const URL = `https://forum.mir4global.com/rank?ranktype=1&worldgroupid=12&worldid=509&classtype=0&searchname=${i.name}&globalSearch=1`;
          const encodedURI = encodeURI(URL);
          // start of the program
          const getCricketWorldCupsList = async () => {
            const cricketWorldCupRawData = await getRawData(encodedURI);
            const parsedSampleData = await cheerio.load(cricketWorldCupRawData);

            const name = parsedSampleData('.user_name').text().replace(/ /g, "")

            if (name) {
              const server =  `${parsedSampleData('[id^=worldgroup_name]').text().slice(3)} ${parsedSampleData('[id^=world_name]').text().slice(3)}`.replace(/ /g, "")
              const ranking = parsedSampleData('.rank_num .num').text().replace(/ /g, "")
              const clan = parsedSampleData("tbody tr").children().children()[2].children[0].data?parsedSampleData("tbody tr").children().children()[2].children[0].data.replace(/ /g, ""):''
              const ps = parsedSampleData('.list_article .text_right span').text().replace(/ /g, "")
              // console.log(`server ${server} ranking ${ranking} name ${name} clan ${clan} power score ${ps}  `);
              console.log('-----');
              console.log(server);
              console.log(ranking);
              console.log(name);
              console.log(clan);
              console.log(ps);
              console.log(ranking);

            }
          };

          // invoking the main function
          await getCricketWorldCupsList()

        }));

      })


      // const promise = new Promise((resolve, reject) => {
      //   // Hace una nueva solicitud de red
      //   if (response.status === 200) {
      //     resolve(response.body)
      //   } else {
      //     reject(error)
      //   }
      // })

      // promise.then(res => {
      //   console.log(res)
      // }).catch(err => {
      //   console.log(err)
      // })




    }
  }



}


