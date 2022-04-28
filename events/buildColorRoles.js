const { MessageEmbed } = require('discord.js');

const embeds = [
  {
    embed: new MessageEmbed()
      .setImage('https://media.discordapp.net/attachments/852955255377625158/964627687001952326/elma-003.gif?size=4096'),
  },
  {
    embed: new MessageEmbed()
      .setTitle(`◜ Olá! ◞`)
      .setDescription(`Você já me conhece e sabe como isso funciona, então deixa a **Elminha** aqui te ajudar! Pode escolher as cores que você quer!`)
  },
  {
    embed: new MessageEmbed()
      .setTitle(`◜ Cores por cargo ◞`),
    roles: [ 
      { name: 'Preto', emoji: '🎩', id: '963841156054122536' },
      { name: 'Marronzinho', emoji: '🦔', id: '963837561602727936' },
      { name: 'Vermelhinho', emoji: '🍄', id: '963838347351040080' },
      { name: 'Laranjinha', emoji: '🍂', id: '963837853400449064' },
      { name: 'Amarelinho', emoji: '🐝', id: '963839074941149225' },
      { name: 'Azul', emoji: '🐟', id: '963841355652661318' },
      { name: 'Azul pastel', emoji: '💠', id: '963841580169588777' },
      { name: 'Lilás', emoji: '🔮', id: '963839347902271538' },
      { name: 'Rosa', emoji: '🌺', id: '963838555828936777' },
      { name: 'Rosa pastel', emoji: '🌸', id: '963838097764778065' },
      { name: 'Verdinho', emoji: '🍀', id: '963838712930770974' },
      { name: 'Branco', emoji: '🍚', id: '963836439588659240' },
    ]
  },
  {
    embed: new MessageEmbed()
      .setTitle(`◜ Tchau tchau! ◞`)
      .setImage("https://media.discordapp.net/attachments/852955255377625158/964627723685359636/elma-004.gif?size=4096")
  }
];
module.exports['embeds'] = embeds;

exports.run = async (client, message) => {
  try {
    const channel = await message.guild.channels.fetch('962776153427423312');

    module.exports['embeds'] = embeds;

    channel.bulkDelete(embeds.length);
    
    embeds.map(obj => {
      obj.embed.setColor(client.config.colors.invisible);
      setTimeout(() => {
        if (Array.isArray(obj['roles'])) {
          let desc = ``;
          obj['roles'].map(role => {
            desc += 
`
◜${role['emoji']}◞ ― \`${role['name']}\`
`;
            let id = embeds.indexOf(obj)
            obj.embed.setDescription(desc);
            embeds[id] = obj;
            module.exports['embeds'] = embeds;
          })
        }

        
        channel.send({ embeds: [obj.embed] }).then(msg => {
          embeds[embeds.indexOf(obj)].id = msg.id;
          client.db.set(`reactionRoles.colors`, embeds);
          if (obj['roles'] && Array.isArray(obj['roles'])) {
            obj['roles'].map(role => {
              setTimeout(() => {
                role['emoji'] ? msg.react(role['emoji']) : null;
              }, 1200);
            })
          }
        });
      }, 5000);
    })

    message.reply("Cores por reação/cargo construído com sucesso.").then(msg => {
      setTimeout(() => {
        message.delete();
        msg.delete();
      }, 5000);
    });
  } catch (err) {
    console.error(err);
    message.reply(`Falha ao construir cores por reação/cargo. Por favor, verifique o console!`).then(msg => {
      setTimeout(() => {
        message.delete();
        msg.delete();
      }, 5000);
    });
  }
}