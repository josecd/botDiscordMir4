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
var db = require('./database')
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  client.on(event.name, (...args) => event.execute(...args, client));
};


client.on("messageCreate", (message) => {
  if (message.content.startsWith(prefix + "initServer")) {
    const mensaje = message.content.slice(9)
    console.log(mensaje);
    const sql1 = `SELECT * FROM clanes`
    db.query(sql1, (err, rows) => {
      rows.map(async (element) => {
        message.guild.roles.create({ name:element.name, color:'#'+(Math.random()*0xFFFFFF<<0).toString(16)})
          .then((res => {
            message.channel.send(`debug result:\n${res}`)
          })).catch((err => {
            message.channel.send(`error:\n${err}`)
          }))
      });

    })
  }
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;
  try {
    await command.execute(interaction, client, config);
  } catch (error) {
    console.error(error);
    return interaction.reply({
      content: 'There was an error while executing this command!',
      ephemeral: true
    });
  };
});

function random(colors) {
  return colors[Math.floor(Math.random() * colors.length)];
};

client.login(require('./token.json').token);
