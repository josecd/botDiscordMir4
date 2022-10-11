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
    if (message.content.startsWith(prefix + "sadas")) {
    // if (message.content.startsWith(prefix + "updatepj")) {

      
      const mensaje = message.content.slice(12);
      console.log(mensaje);
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


      await  (async () => {
        try {
          const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox']
          })
          const page = await browser.newPage();
          const response = await page.goto(`https://forum.mir4global.com/rank?ranktype=1&worldgroupid=12&worldid=509&classtype=0&searchname=Nessin&globalSearch=1`);
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


          console.log(totalMembers.find(res=> res.id =='665593576448851968'));
          // console.log(totalMembers.find(member => console.log(member)));
          // let member =message.guild.members.cache.get('665593576448851968')
          // member = await member.setNickname(`[${ranking}] ${name} ${powerscore}`);
          totalMembers.find(res=> res.id =='665593576448851968').setNickname(`[${ranking}] ${name} ${powerscore}`)
          // member = await member.setNickname('cool guy');

          
          await browser.close();
        } catch (error) {
          console.error(error);
        }
      })();
      return false
      const sqlte = `SELECT * FROM registry`
      db.query(sqlte, (err, rows) => {
        rows.map(async (infos) => {

          // const sql2 = `UPDATE registry SET activo=0 WHERE id='${infos.id}'`
          // db.query(sql2, (err, rows) => {})

           await  (async () => {
              try {
                const browser = await puppeteer.launch({
                  headless: true,
                  args: ['--no-sandbox']
                })
                const page = await browser.newPage();
                const response = await page.goto(`https://forum.mir4global.com/rank?ranktype=1&worldgroupid=12&worldid=509&classtype=0&searchname=Ⓛⓨⓝⓗ&globalSearch=1`);
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
                console.log(`[${ranking}] ${name} ${powerscore}`);
                console.log(infos);
                console.log(infos.discorduserid);
                message.guild.members.cache.get('895083924223569930').setNickname(`[${ranking}] ${name} ${powerscore}`)
    
    

                
                await browser.close();
              } catch (error) {
                console.error(error);
              }
            })();
        

        });
      })

      // console.log(mensaje);
    }
  }
}
