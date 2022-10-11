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
    if (message.content.startsWith(prefix + "updatepjs")) {
      // if (message.content.startsWith(prefix + "register1" || message.content.startsWith(prefix + "Register1"))) {
      await message.guild.members.fetch() //cache all members in the server

      const sqlRegistry = `SELECT * FROM registry where activo='1'`
      let clanes = await `SELECT * FROM clanes`

      db.query(sqlRegistry, async (err, rows) => {

        const asyncRes = await Promise.all(rows.map(async (i) => {
          const getRawData = (URL) => {
            return fetch(URL)
              .then((response) => response.text())
              .then((data) => {
                return data;
              });
          };
          const URL = `https://forum.mir4global.com/rank?ranktype=1&worldgroupid=12&worldid=509&classtype=0&searchname=${i.name}&globalSearch=1`;
          const encodedURI = encodeURI(URL);
          const getCricketWorldCupsList = async () => {
            const cricketWorldCupRawData = await getRawData(encodedURI);
            const parsedSampleData = await cheerio.load(cricketWorldCupRawData);
            const name = parsedSampleData('.user_name').text()



            if (name) {
              let server = `${parsedSampleData('[id^=worldgroup_name]').text().slice(3)} ${parsedSampleData('[id^=world_name]').text().slice(3)}`.replace(/ /g, "")
              let ranking = parsedSampleData('.rank_num .num').text().replace(/ /g, "")
              let clan = parsedSampleData("tbody tr").children().children()[2].children[0].data ? parsedSampleData("tbody tr").children().children()[2].children[0].data : ''
              let ps = parsedSampleData('.list_article .text_right span').text().replace(/ /g, "")
              // console.log(name);
              // console.log(server);
              // console.log(ranking);
              // console.log(clan);
              // console.log(ps);

              const user = message.guild.members.cache.get(i.discorduserid)

              if (user) {
                await user.setNickname(`[${ranking}] ${name} ${ps}`).then(res => {
                  console.log(`ok ${i.usernameds}`);
                })
              } else {
                console.log(`fail discord no found ${i.usernameds}`);
                const sql2 = await `UPDATE registry SET activo=0 WHERE discorduserid='${i.discorduserid}'`
                db.query(sql2, (err, rows) => { })
                return false;
              }


              if (clan) {
                //Verificaremos clan
                const sql1 = await `SELECT * FROM clanes WHERE name = '${clan}'`
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
                      console.log(i.discorduserid);
                      console.log(`[${ranking}] ${name} ${ps}`);
                      console.log(message.guild.members.cache.get(i.discorduserid).setNickname(`[${ranking}] ${name} ${ps}`));

                      // message.guild.members.cache.get(i.discorduserid).setNickname(`[${ranking}] ${name} ${ps}`)
                      clan == clan ? message.guild.members.cache.get(i.discorduserid).roles.add(clanObj.id) : '';
                      message.guild.members.cache.get(i.discorduserid).roles.add('1017844427441578084')

                      //insertar en la base de datos

                      var name2 = name;
                      const sql = await`INSERT INTO registry (username,usernameds, displayName, ranking,name,clan,powescore,server, created_at,activo,discorduserid) 
                                              VALUES ("${i.username}", "${i.usernameds}", "${i.displayName}","${ranking}","${name2}","${clan}","${ps}","${server}", NOW(),1,${i.discorduserid})`
                      db.query(sql, (err, rows) => { /* */ })

                    } else {

                      return false
                    }



                  } else {
                    console.log(`clan ~~${clan}~~  is not whitelisted`);
                    const sql2 = await`UPDATE registry SET activo=0 WHERE discorduserid='${i.discorduserid}'`
                    db.query(sql2, (err, rows) => { })

                    const valores = message.guild.roles.cache
                    const valores2 = clanes

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
                      message.guild.members.cache.get(i.discorduserid).roles.remove(rolClan.id)
                    });
                    let rol54 = message.guild.roles.cache.find(member => member.name == `NA54`);
                    rol54 ? message.guild.members.cache.get(i.discorduserid).roles.remove(rol54.id) : ''
                    message.guild.members.cache.get(i.discorduserid).setNickname("")
                    return false
                  }
                })


              } else {
                console.log(`You don't have a clan ${i.usernameds}`);
                const sql2 = await `UPDATE registry SET activo=0 WHERE discorduserid='${i.discorduserid}'`
                db.query(sql2, (err, rows) => { })

                const valores = message.guild.roles.cache
                const valores2 = clanes

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
                  message.guild.members.cache.get(i.discorduserid).roles.remove(rolClan.id)
                });
                let rol54 = message.guild.roles.cache.find(member => member.name == `NA54`);
                rol54 ? message.guild.members.cache.get(i.discorduserid).roles.remove(rol54.id) : ''
                message.guild.members.cache.get(i.discorduserid).setNickname("")



                return false;
              }
            } else {
              console.log('----------------', i.discorduserid);
              console.log(`You don't have a user forum ${i.usernameds}`);
                const sql2 = await `UPDATE registry SET activo=0 WHERE discorduserid='${i.discorduserid}'`
                db.query(sql2, (err, rows) => { })

                const valores = message.guild.roles.cache
                const valores2 = clanes

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
                  message.guild.members.cache.get(i.discorduserid).roles.remove(rolClan.id)
                });
                let rol54 = message.guild.roles.cache.find(member => member.name == `NA54`);
                rol54 ? message.guild.members.cache.get(i.discorduserid).roles.remove(rol54.id) : ''
                message.guild.members.cache.get(i.discorduserid).setNickname("")



                return false;
            }


          };
          await getCricketWorldCupsList()

        }))


      })
    }
  }



}


