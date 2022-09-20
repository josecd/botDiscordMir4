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

client.login(require('./token.json').token);
