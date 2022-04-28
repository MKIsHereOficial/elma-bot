const { MessageEmbed, MessageActionRow } = require('discord.js');

const { splitIntoChunk } = require('../utils/array');

exports.run = async ({ client, interaction , options }) => {
  const user = interaction.user;

  if (!(await client.db.get('levels'))) {
    await client.db.set('levels', {});
  }

  const levels = await client.db.get('levels');
  const idsArray = Object.keys(levels);
  const valuesArray = Object.values(levels);
  let originalArray = [];

  valuesArray.map(d => {
    originalArray.push({ id: idsArray[valuesArray.indexOf(d)], ...d });
  });
  
  originalArray = originalArray.sort((a,b) => a.level === b.level ? b.xp - a.xp : b.level - a.level);
  let array = [];  
  originalArray.map(item => { 
    if (item.level <= 0 && item.xp <= 0) null; 
    else array.push(item);
  })

  originalArray = array;

  let rankIndex = array.findIndex(item => item.id === user.id) + 1;

  let arraySections = splitIntoChunk(array, 10);
  let arraySectionIndex = 0;


  let data = client.db.get(`levels.${user.id}`); 

  if (!data) { data = { xp: 0, max_xp: 100, level: 0 }; await client.db.set(`levels.${user.id}`, data); }
  if (!data['xp'])     { data['xp'] = 0; await client.db.set(`levels.${user.id}`, data); }
  if (!data['max_xp']) { data['max_xp'] = 0; await client.db.set(`levels.${user.id}`, data); }
  if (!data['level'])  { data['level'] = 0; await client.db.set(`levels.${user.id}`, data); }

  ////////////////////////////////////////////////////////////////
  let actionRowOne = new MessageActionRow();
 

  function updateComponents() {
    actionRowOne = new MessageActionRow();

    actionRowOne.addComponents({
      type: 'BUTTON',
      customId: `${interaction.user.id}_${interaction.id}_leaderboard.prev`,
      emoji: '<:point_right:965689307128004658>',
      style: 'PRIMARY',
      disabled: arraySections[arraySectionIndex - 1] ? false : true,
    },
    {
      type: 'BUTTON',
      customId: `${interaction.user.id}_${interaction.id}_leaderboard.next`,
      emoji: '<:point_left:965689497155170444>',
      style: 'PRIMARY',
      disabled: arraySections[arraySectionIndex + 1] ? false : true,
    }
    )
  }

  updateComponents()
  
  ////////////////////////////////////////////////////////////////

  let description = `Páginas ${arraySectionIndex + 1}/${arraySections.length}\n\n`;

  let embed = new MessageEmbed()
    .setTitle('Placar de Líderes')
    .setDescription(description)
    .setFooter({ text: `Sua posição: ${rankIndex}º` })
    .setColor(client.config.colors.invisible)
    .setTimestamp();

  let embedInt;

  async function updateEmbed() {
    array = arraySections[arraySectionIndex];
    description = `Páginas ${arraySectionIndex + 1}/${arraySections.length}\n\n`

    await array.map(async item => {
      let u = (client.users.cache.get(item.id)) ? (client.users.cache.get(item.id)).tag : item.id  // Usuário
      description += `${originalArray.indexOf(item) + 1}. \`${u}\` • LVL ${item.level} - ${item.xp} XP\n`;
      embed.setDescription(description);
    });    
    
    if (!embedInt) { await interaction.reply({ embeds: [embed], components: [actionRowOne], fetchReply: true }).then(i => { embedInt = i; }); }
    else { await embedInt.edit({ embeds: [embed], components: [actionRowOne] }) }
  }

  await updateEmbed();

  client.on('interactionCreate', async (i) => {
    if (!i.isMessageComponent()) return;
    if (!i.customId.startsWith(`${interaction.user.id}_${interaction.id}_leaderboard.`)) return;

    let uId = i.customId.split("_")[0];

    if (i.user.id != uId) return;

    switch (i.customId) {
      case `${interaction.user.id}_${interaction.id}_leaderboard.prev`: {
        if (arraySectionIndex - 1 < 0) return await i.reply({ content: `Não foi possível voltar de página; Motivo: Página "0" inexistente `, ephemeral: true });
        arraySectionIndex -= 1;  
        await updateComponents();
        await updateEmbed();
        await i.reply({ content: `Você voltou uma página \`${arraySectionIndex + 1}/${arraySections.length}\``, ephemeral: true });
        break;
      }
      case `${interaction.user.id}_${interaction.id}_leaderboard.next`: {
        if (arraySectionIndex + 1 > arraySections.length - 1) return await i.reply({ content: `Não foi possível passar de página; Motivo: Página "${arraySectionIndex + 1}" inexistente `, ephemeral: true });
        arraySectionIndex += 1; 
        await updateComponents();
        await updateEmbed();
        await i.reply({ content: `Você avançou uma página \`${arraySectionIndex + 1}/${arraySections.length}\``, ephemeral: true });
        break;
      }
      default: 
        await i.reply({ content: `Interação concluída`, ephemeral: true });
        break;
    }    
  });
}

exports.help = {
  name: 'leaderboard',
  description: 'Veja o placar de líderes. Seu rank está incluído nele',
  section: 'util',
}

const { SlashCommandBuilder, SlashCommandUserOption } = require('@discordjs/builders');

exports.slash = new SlashCommandBuilder()
  .setName('leaderboard')
  .setDescription('◜💫 Utilidades◞ ― Veja o placar de líderes');