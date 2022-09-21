
const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder,ButtonBuilder ,ButtonStyle } = require('discord.js')
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages
  ]
});


module.exports = {
  name: 'ready',
  async execute(client) {
    //canal mandar mensaje inicial ticket
    const oniChan = client.channels.cache.get('1021985427328090162')
    function sendTicketMSG() {
      const embed = new EmbedBuilder()
        .setColor('ff0000')
        .setTitle('Crear una mochila')
        .setDescription('Bienvenido al registro de las mochilas CG')
        // .setFooter(client.config.footerText, client.user.avatarURL())
      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
          .setCustomId('open-ticket')
          .setLabel('Registrar mochila')
          .setEmoji('🎒')
          .setStyle(ButtonStyle.Primary),
          // .setStyle('PRIMARY'),
        );

      oniChan.send({
        embeds: [embed],
        components: [row]
      })
    }

    const toDelete = 10000;

    async function fetchMore(channel, limit) {
      if (!channel) {
        throw new Error(`Kanal created ${typeof channel}.`);
      }
      if (limit <= 100) {
        return channel.messages.fetch({
          limit
        });
      }

      let collection = [];
      let lastId = null;
      let options = {};
      let remaining = limit;

      while (remaining > 0) {
        options.limit = remaining > 100 ? 100 : remaining;
        remaining = remaining > 100 ? remaining - 100 : 0;

        if (lastId) {
          options.before = lastId;
        }

        let messages = await channel.messages.fetch(options);

        if (!messages.last()) {
          break;
        }

        collection = collection.concat(messages);
        lastId = messages.last().id;
      }
      collection.remaining = remaining;

      return collection;
    }

    const list = await fetchMore(oniChan, toDelete);

    let i = 1;

    list.forEach(underList => {
      underList.forEach(msg => {
        i++;
        if (i < toDelete) {
          setTimeout(function () {
            msg.delete()
          }, 1000 * i)
        }
      })
    })

    setTimeout(() => {
      sendTicketMSG()
    }, i);
  },
};
