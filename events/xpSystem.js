const random = require('random');

const { MessageEmbed } = require('discord.js');

exports.data = {
  name: 'messageCreate',
}

exports.run = async (client, message) => {
  if (!message.guild || message.author.bot) return;

  let userXp = await client.db.get(`${message.author.id}.xp`);
  if (!userXp) { userXp = 0; await client.db.set(`${message.author.id}.xp`, 0) };
  let maxXp = await client.db.get(`${message.author.id}.max_xp`);
  if (!maxXp) { maxXp = 0; await client.db.set(`${message.author.id}.max_xp`, 100) };

  if (!(await client.db.get(`${message.author.id}.level`))) await client.db.set(`${message.author.id}.level`, 0);

  let userLevel = parseInt(await client.db.get(`${message.author.id}.level`));
  let newLevel = parseInt(userLevel);
  

  async function checkNewLevel() {
    if (userXp >= ((await client.db.get(`${message.author.id}.max_xp`)) || 100)) {
      newLevel += 1;
      await client.db.set(`${message.author.id}.xp`, Math.round((await client.db.get(`${message.author.id}.xp`)) - (await client.db.get(`${message.author.id}.max_xp`))));
      maxXp = Math.round((await client.db.get(`${message.author.id}.max_xp`)) * 2);
      await client.db.set(`${message.author.id}.max_xp`,  maxXp);

      const embed = new MessageEmbed()
        .setTitle("Parabéns! Você acaba de passar de nível!")
        .setDescription(`Passou do nível \`${userLevel}\` para o nível \`${newLevel}\`.`)
        .setFooter({text: "Essa mensagem será deletada automaticamente"})
        .setColor(client.config.colors.invisible)
        .setTimestamp();


      console.log(`[XP SYSTEM]`,`${message.author.tag}:`, `Passou do nível ${await client.db.get(`${message.author.id}.level`)} para o ${await client.db.get(`${message.author.id}.level`) + 1}`);

      if (parseFloat(await client.db.get(`${message.author.id}.xp`)) >= parseFloat(await client.db.get(`${message.author.id}.max_xp`))) {
        return checkNewLevel();
      }

      await message.reply({ content: `${message.author}`, embeds: [embed] }).then(async msg => {
        await client.db.set(`${message.author.id}.level`, newLevel);
        setTimeout(async () => {
          msg && msg.deletable ? await msg.delete() : null;
        }, 15 * 1000);
      });
    }
  }
  exports.checkNewLevel = checkNewLevel;

  let randXp = Math.round(parseFloat(random.float(0, 10).toFixed(2)));
  
  let cmds = ['reset', 'levelup', 'nocooldown'];
  if (client.creators.includes(message.author.id)) {
    let includesCmd = false;

    cmds.map(cmd => {
      if (message.content.toLowerCase().includes(`--${cmd}`)) includesCmd = true;
    })
    
    if (message.content.toLowerCase().includes(`--${cmds[0]}`)) {
      await client.db.set(`${message.author.id}.level`, 0);
      await client.db.set(`${message.author.id}.xp`, 0);
      await client.db.set(`${message.author.id}.max_xp`, 0);
      await client.db.set(`${message.author.id}.last_xp_message_timestamp`, 0);
      return;
    }
    if (message.content.toLowerCase().includes(`--${cmds[1]}`)) randXp = ((await client.db.get(`${message.author.id}.max_xp`)) - (await client.db.get(`${message.author.id}.xp`))) || 100;
  }

  if (!(client.creators.includes(message.author.id) && message.content.toLowerCase().includes(`--${cmds[2]}`)) && await client.db.get(`${message.author.id}.last_xp_message_timestamp`) && Date.now() - (await client.db.get(`${message.author.id}.last_xp_message_timestamp`)) <= 60000) {
    return;
  } else {
    await client.db.add(`${message.author.id}.xp`, randXp);
    await client.db.set(`${message.author.id}.last_xp_message_timestamp`, Date.now());
  }

  await checkNewLevel();

  console.log(`[XP SYSTEM]`, `${message.author.tag}:`, `${randXp} xp ganhos de um total de ${userXp}/${(await client.db.get(`${message.author.id}.max_xp`))} xp`);
}