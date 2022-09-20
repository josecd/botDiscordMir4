let hastebin = require('hastebin');
var db = require('../database')

const { Client, GatewayIntentBits, EmbedBuilder,
  ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType,
  PermissionsBitField, SelectMenuBuilder, SelectMenuOptionBuilder } = require('discord.js')
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

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    if (!interaction.isButton()) return;
    if (interaction.customId == "open-ticket") {

      if (client.guilds.cache.get(interaction.guildId).channels.cache.find(c => c.topic == interaction.user.id)) {
        interaction.reply({
          content: '¡Ya tienes un registro creado!',
          ephemeral: true
        });
        return false
      };

      if (false) {
        return false
      }

      await interaction.guild.channels.create({
        name: `registro-${interaction.user.username}`,
        type: ChannelType.GuildTex,
        topic: interaction.user.id,
        //categoria donde se abren los tickets
        parent: '1018994126991134730',
        permissionOverwrites: [{
          id: interaction.user.id,
          allow: [PermissionsBitField.Flags.ViewChannel,
          PermissionsBitField.Flags.SendMessages,
          PermissionsBitField.Flags.ReadMessageHistory],
        },
        {
          //Rol support
          id: '1018992663090966598',
          allow: [PermissionsBitField.Flags.ViewChannel,
          PermissionsBitField.Flags.SendMessages,
          PermissionsBitField.Flags.ReadMessageHistory],
        },
        {
          id: interaction.guild.roles.everyone,
          deny: [PermissionsBitField.Flags.ViewChannel],
        },
        ],
      }).then(async c => {
        interaction.reply({
          content: `¡Registro iniciado! <#${c.id}>`,
          ephemeral: true
        }, err => {
          console.log(err);
        })

        const embed = new EmbedBuilder()
          .setColor('ff9600')
          .setTitle('Registrar mochila')
          .setDescription('Solo se pueden regitrar 2 mochilas.')
          // .setFooter({ text: 'Solo se pueden regitrar 2 mochilas.' })
          .setTimestamp();

        const row = new ActionRowBuilder()
          .addComponents(
            new SelectMenuBuilder()
              .setCustomId('selectmenu')
              .setPlaceholder('Elige una opción')
              .setMinValues(1)
              .setMaxValues(1)
              .setOptions(new SelectMenuOptionBuilder({
                label: 'Ver mis mochilas',
                value: 'vermochilas',
                emoji: { name: '👀' }
              }), new SelectMenuOptionBuilder({
                label: 'Registrar',
                value: 'registrar',
                emoji: { name: '📑' }
              }))
            // .addOptions([{
            //   label: 'Ver mis mochilas',
            //   value: 'vermochilas',
            //   emoji: { name: '👀' }
            // },
            // {
            //   label: 'Registrar',
            //   value: 'registrar',
            //   emoji: { name: '📑' }
            // },
            // ]),
          )

        msg = await c.send({
          content: `<@!${interaction.user.id}>`,
          embeds: [embed],
          components: [row]
        });

        const collectors = msg.createMessageComponentCollector({
          time: 20000
        });


        collectors.on('collect', async (i) => {
          if (i.user.id === interaction.user.id) {
            if (msg.deletable) {
              msg.delete().then(async () => {
                const embed = new EmbedBuilder()
                  .setColor('ff9600')
                  .setTitle('Registro')
                  .setDescription(`<@!${interaction.user.id}> ha creado un **Registro** con la razon・ ${i.values[0]}`)
                  .setFooter({ text: 'Register System' })
                  .setTimestamp();

                const row = new ActionRowBuilder()
                  .addComponents(
                    new ButtonBuilder()
                      .setCustomId('close-register')
                      .setLabel('Cerrar registro')
                      .setEmoji('899745362137477181')
                      .setStyle('Danger'),
                  );

                const opened = await c.send({
                  //Rol support
                  content: `<@&${'1018992663090966598'}>`,
                  embeds: [embed],
                  components: [row]
                });

                opened.pin().then(() => {
                  opened.channel.bulkDelete(1);
                });
              });
            };
            if (i.values[0] == 'vermochilas') {

              const sql = `SELECT * FROM backpacks WHERE usernameds = '${interaction.user.username + '#' + interaction.user.discriminator}'`
              db.query(sql, (err, rows) => {
                rows.map(async (res) => {
                  (async () => {
                    try {
                      const browser = await puppeteer.launch();
                      const page = await browser.newPage();
                      const response = await page.goto(`https://forum.mir4global.com/rank?ranktype=1&worldgroupid=12&worldid=509&classtype=0&searchname=${res.nameBackpack}&globalSearch=1`);
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
                        c.send({ embeds: [embed] })
                      } else {
                        const embed = new EmbedBuilder()
                          .setColor('ff9600')
                          .setTitle('Player information')
                          .setDescription(`No results found`)
                          .setFooter({ text: 'Information is updated every day at 03:00 PM Server time.' })
                        c.send({ embeds: [embed] })
              
                      }
              
              
              
                      await browser.close();
                    } catch (error) {
                      console.error(error);
                    }
                  })();
                });
              });

              c.edit({
                //categoria donde se abren los tickets
                parent: '1018994126991134730'
              });
            };
            if (i.values[0] == 'registrar') {
              
              c.edit({
                //Rol support
                parent: '1018992663090966598'
              });
            };
          };
        });

        collectors.on('end', collected => {
          if (collected.size < 1) {
            c.send(`No hubo motivo, el registro se cerrará en un momento.`).then(() => {
              setTimeout(() => {
                if (c.deletable) {
                  c.delete();
                };
              }, 5000);
            });
          };
        });
      });
    };



    if (interaction.customId == "close-register") {
      const guild = client.guilds.cache.get(interaction.guildId);
      const chan = guild.channels.cache.get(interaction.channelId);

      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('confirm-close')
            .setLabel('Cerrar registro')
            .setStyle('Danger'),
          new ButtonBuilder()
            .setCustomId('no')
            .setLabel('cancelar')
            .setStyle('Secondary'),
        );

      const verif = await interaction.reply({
        content: '¿Seguro que quieres cerrar el ticket?',
        components: [row]
      });

      const collector = interaction.channel.createMessageComponentCollector({
        time: 10000
      });

      collector.on('collect', i => {
        if (i.customId == 'confirm-close') {
          interaction.editReply({
            content: `El registro ha sido cerrado por <@!${interaction.user.id}>`,
            components: []
          });
          chan.edit({
            name: `closed-${chan.name}`,
            permissionOverwrites: [
              {
                id: client.users.cache.get(chan.topic),
                deny: [PermissionsBitField.Flags.ViewChannel,
                PermissionsBitField.Flags.SendMessages
                ],
              },
              {
                //role support
                id: '1018992663090966598',
                allow: [PermissionsBitField.Flags.ViewChannel,
                PermissionsBitField.Flags.SendMessages
                ],
              },
              {
                id: interaction.guild.roles.everyone,
                deny: [PermissionsBitField.Flags.ViewChannel],
              },
            ],
          })
            .then(async () => {
              const embed = new EmbedBuilder()
                .setColor('ff9600')
                .setTitle('registro')
                .setDescription('```Guardando registro```')
                .setFooter({ text: 'Register system' })
                .setTimestamp();

              const row = new ActionRowBuilder()
                .addComponents(
                  new ButtonBuilder()
                    .setCustomId('delete-ticket')
                    .setLabel('Eliminar registro')
                    .setEmoji('🗑️')
                    .setStyle('Danger'),
                );

              chan.send({
                embeds: [embed],
                components: [row]
              });
            });

          collector.stop();
        };
        if (i.customId == 'no') {
          interaction.editReply({
            content: '¡Cerrar ticket cancelado!',
            components: []
          });
          collector.stop();
        };
      });

      collector.on('end', (i) => {
        if (i.size < 1) {
          interaction.editReply({
            content: '¡Cierre de ticket cancelado!',
            components: []
          });
        };
      });
    };

    if (interaction.customId == "delete-ticket") {
      const guild = client.guilds.cache.get(interaction.guildId);
      const chan = guild.channels.cache.get(interaction.channelId);
      interaction.reply({
        content: 'Guardando ticket...'
      });


      const embed = new EmbedBuilder()
      .setTitle('Logs registro')
      .setDescription(`📰 Registro-Logs \`${chan.id}\` creado <@!${chan.topic}> eliminado por <@!${interaction.user.id}>\n\n`)
      .setColor('2f3136')
      .setTimestamp();

    // const embed2 = new client.discord.MessageEmbed()
    //   .setAuthor('Logs Ticket', ' ')
    //   .setDescription(`📰 Logs de tu ticket \`${chan.id}\`: [**Click para ver los logs**](${urlToPaste})`)
    //   .setColor('2f3136')
    //   .setTimestamp();

    //canal de logs
    client.channels.cache.get('1019031315582038118').send({
      embeds: [embed]
    });
    // client.users.cache.get(chan.topic).send({
    //   embeds: [embed2]
    // }).catch(() => {console.log('I cant send it DM')});
    chan.send('Eliminando canal.');

    setTimeout(() => {
      chan.delete();
    }, 5000);
    
    };
  },
};
