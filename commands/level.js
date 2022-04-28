const { MessageEmbed, MessageAttachment } = require('discord.js');

const canvacord = require('canvacord');

exports.run = async ({ client, interaction , options }) => {
  let user = options.getUser('user', false) || interaction.user; 
  let member = options.getMember('user', false) || interaction.member;

  if (!(await client.db.get('levels'))) {
    await client.db.set('levels', {});
  }

  const levels = await client.db.get('levels');
  const idsArray = Object.keys(levels);
  const valuesArray = Object.values(levels);
  let array = [];

  valuesArray.map(d => {
    array.push({ id: idsArray[valuesArray.indexOf(d)], ...d });
  });

  array = array.sort((a,b) => a.level === b.level ? b.xp - a.xp : b.level - a.level);
  let rankIndex = array.findIndex(item => item.id === user.id) + 1;

  let data = client.db.get(`levels.${user.id}`); 

  if (!data) { data = { xp: 0, max_xp: 100, level: 0 }; await client.db.set(`levels.${user.id}`, data); }
  if (!data['xp'])     { data['xp'] = 0; await client.db.set(`levels.${user.id}`, data); }
  if (!data['max_xp']) { data['max_xp'] = 0; await client.db.set(`levels.${user.id}`, data); }
  if (!data['level'])  { data['level'] = 0; await client.db.set(`levels.${user.id}`, data); }
	
  const rank = new canvacord.Rank()
    .renderEmojis(true)
    .setAvatar(user.displayAvatarURL({ format: 'png', dynamic: true, size: 2048 }))
    .setRank(rankIndex, 'RANK')
    .setLevel(data.level)
    .setCurrentXP(data.xp)
    .setRequiredXP(data.max_xp)
    .setStatus("offline")
    .setProgressBar("#F3F8FF", "COLOR")
    .setOverlay('#000', 0.35)
    .setUsername(user.username)
    .setDiscriminator(user.discriminator);

  const img = new MessageAttachment(await rank.build(), `rank_${user.id}_${Date.now()}.webp`);
  
  await interaction.reply({ files: [img] });
}

exports.help = {
  name: 'level',
  description: 'Veja seu nível ou o de outras pessoas',
  section: 'util',
}

const { SlashCommandBuilder, SlashCommandUserOption } = require('@discordjs/builders');

exports.slash = new SlashCommandBuilder()
  .setName('level')
  .setDescription('◜💫 Utilidades◞ ― Veja seu nível e o de outras pessoas')
  .addUserOption(
    new SlashCommandUserOption()
      .setName('user')
      .setDescription('Usuário - A pessoa de quem você quer ver o nível')
  );