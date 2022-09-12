const prefix = "!";

const express = require('express');
const app = express();
const port = 3000;


const { Client, GatewayIntentBits, EmbedBuilder, GuildMember } = require('discord.js')
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
var db = require('./database')

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

//register
client.on("messageCreate", (message) => {
  if (message.content.startsWith(prefix + "register")) {
    const mensaje = message.content.slice(10);
    if (message.author.username != message.guild.members.cache.get(message.author.id).displayName) {
      const embed = new EmbedBuilder()
        .setColor('ff9600')
        .setTitle('Player information')
        .setDescription(`You are already registered use the command !unregister`)
        .setFooter({ text: 'Information is updated every day at 03:00 PM Server time.' })
      message.channel.send({ embeds: [embed] })
      return false;
    }
    if (mensaje) {
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

              message.guild.members.cache.get(message.author.id).setNickname(`[${ranking}] ${name} ${powerscore}`)
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

              if (server == 'NA54') {
                message.guild.members.cache.get(message.author.id).roles.add(rol54.id)
              } else if (server == 'NA76') {
                message.guild.members.cache.get(message.author.id).roles.add(rol76.id)
              }
              clan == 'DTM Ç G' ? message.guild.members.cache.get(message.author.id).roles.add(clanDTMÇG.id) : '';
              clan == 'DTM Infra' ? message.guild.members.cache.get(message.author.id).roles.add(clanDTMInfra.id) : '';
              clan == 'DTM LaOrden' ? message.guild.members.cache.get(message.author.id).roles.add(clanDTMLaOrden.id) : '';
              clan == 'DTM CG ALO' ? message.guild.members.cache.get(message.author.id).roles.add(clanDTMCGALO.id) : '';
              clan == 'DTM CG´' ? message.guild.members.cache.get(message.author.id).roles.add(clanDTMCGcomilla.id) : '';
              clan == 'DTM CG WINX' ? message.guild.members.cache.get(message.author.id).roles.add(clanDTMCGWINX.id) : '';
              clan == 'DTM CGØrigen' ? message.guild.members.cache.get(message.author.id).roles.add(clanDTMCGØrigen.id) : '';
              clan == 'D T M CG' ? message.guild.members.cache.get(message.author.id).roles.add(clanDTMCG.id) : '';

              var username = message.author.username;
              var usernameds = message.author.username +'#'+message.author.discriminator;
              var displayName = `[${ranking}] ${name} ${powerscore}`;
              var name2=name;
              var powescore=powerscore
              var sql = `INSERT INTO registry (username,usernameds, displayName, ranking,name,clan,powescore,server, created_at) 
              VALUES ("${username}", "${usernameds}", "${displayName}","${ranking}","${name2}","${clan}","${powescore}","${server}", NOW())`

              db.query(sql, (err, rows) => { /* */ });

              // db.query(sql, function (err, result) {
              //   if (err) throw err
              //   console.log('Row has been updated')
              // })


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
})

//search
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
});

//Unregister
client.on("messageCreate", (message) => {
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
});


client.on("messageCreate", (message) => {
  if (message.content.startsWith(prefix + "members")) {
    const mensaje = message.content.slice(9)

    var username = 'test'
    var usernameds ='test'
    var displayName ='test'
    var ranking ='test'
    var name='test'
    var clan='test'
    var powescore='test'
    var server='test'

    var sql = `INSERT INTO registry (username,usernameds, displayName, ranking,name,clan,powescore,server, created_at) 
    
    VALUES ("${username}", "${usernameds}", "${displayName}","${ranking}","${name}","${clan}","${powescore}","${server}", NOW())`
    db.query(sql, function (err, result) {
      if (err) throw err
      console.log('Row has been updated')
      // req.flash('success', 'Data stored!')
      // res.redirect('/')
    })

    if (mensaje == 1018729765047369743) {
      console.log('test');

      // console.log(message.guild.channels.cache.get(mensaje));

      // console.log(message.guild.members.cache.filter(member => member.voice.channel));

      console.log(message.guild.channels.cache.get(mensaje).messages.cache);
    }
  }
});


client.login(require('./token.json').token);
