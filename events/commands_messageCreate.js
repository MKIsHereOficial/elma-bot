const { MessageEmbed, MessageAttachment } = require('discord.js');

exports.data = {
  name: 'messageCreate',
}

/**
 * @param {import('discord.js').Client} client 
 * @param {import('discord.js').Message} message 
 * @returns {any}
 */
exports.run = async (client, message) => {
  console.log(message.member);

  if ([`<@!${client.user.id}> registro`, `<@${client.user.id}> registro`].includes(message.content.toLowerCase())) return client.emit('buildRegister', message);
  
  if ([`<@!${client.user.id}>`, `<@${client.user.id}>`].includes(message.content)) {
    let embed = new MessageEmbed()
      .setAuthor({name: `${message.author.tag}`, iconURL: message.author.displayAvatarURL({ format: 'webp', size: 2048 }) })
      .setDescription(
`É um prazer, \`${message.member.displayName}\`, eu sou a **Elma**! Se quiser, pode me chamar de **ajudante** também!

Precisa de algum tipo de ajuda? Eu utilizo comandos \`/\`, então é só utilizar o \`/ajuda\`!
Pra mais ajuda, você pode contatar alguém da equipe **Staff**, ou até mesmo a <@!852948164977098753>

Use o comando \`/botinfo\` pra saber mais sobre mim!
`
      )
      .setFooter({text:`Essa mensagem será deletada automaticamente`})
      .setImage('https://i.ibb.co/KyXJ5Q6/elma-comendo-bolin.gif')
      .setColor(client.config.colors.invisible)
      .setTimestamp();
    
    return message.reply({ content: `${message.member}`, embeds: [embed] }).then(msg => {
      message.delete();
      return setTimeout(() => {
        msg.delete()
      }, 30 * 1000);
    });
  }
}