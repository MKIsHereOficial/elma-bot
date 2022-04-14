const { MessageEmbed } = require('discord.js');

const embeds = [
  {
    embed: new MessageEmbed()
      .setImage('https://i.ibb.co/hK1BxB3/elma-001.gif'),
  },
  {
    embed: new MessageEmbed()
      .setTitle(`◜ Olá! ◞`)
      .setDescription(`Primeiramente, deixa eu me apresentar... É um prazer, eu sou a **Elma**! Assistente oficial do servidor, e uma gostosa que sempre vai te ajudar! (pelo menos eu espero)

Bem, eu só posso falar que vai ser um prazer te ajudar em tudo que precisar... Qualquer coisa, pode chamar a <@!852948164977098753> pra assuntos sobre mim!

Enfim, lá vai o registro!

`)
  },
  {
    embed: new MessageEmbed()
      .setTitle(`◜ Escolha seus pronomes! ◞`),
    roles: [
      { name: 'Ela/Dela', emoji: '🚺', id: '963835508138602506' },
      { name: 'Ele/Dele', emoji: '🚹', id: '963835608596353044' },
      { name: 'Ele/Ela', emoji: '🚻', id: '963835391859912734' },
      { name: 'Elu/Delu', emoji: '🛐', id: '963835280685670430' },
    ]
  },
  {
    embed: new MessageEmbed()
      .setTitle(`◜ Qual a sua idade, bug? ◞`),
    roles: [
      { name: '-18', emoji: '☀️', id: '963834973259956255' },
      { name: '+18', emoji: '🌙', id: '963834860680671262' },
    ]
  },
  {
    embed: new MessageEmbed()
      .setTitle(`◜ E aí bug, é normal ou hétero? ◞`),
    roles: [
      { name: 'LGBTQIAP+', emoji: '🏳️‍🌈', id: '963834333188206612' },
      { name: 'Hétero', emoji: '💑', id: '963834632590225458' },
    ]
  },
  {
    embed: new MessageEmbed()
      .setTitle(`◜ Em qual você se encaixa? ◞`),
    roles: [
      { name: 'Gamer', emoji: '🎮', id: '963833956703293530' },
      { name: 'Otaku', emoji: '⛩', id: '963833853171093504' },
      { name: 'Artista', emoji: '🎨', id: '963834154691219496' },
    ]
  },
  {
    embed: new MessageEmbed()
      .setTitle(`◜ Casada? 😏 ◞`),
    roles: [
      { name: 'Na pista', emoji: '🔓', id: '963832555470200863' },
      { name: 'Enrolade(a/o)', emoji: '💔', id: '963832752015310848' },
      { name: 'Namorandinho', emoji: '💘', id: '963833649608929332' },
      { name: 'Casadinho', emoji: '💍', id: '963833451952349194' },
    ]
  },
  {
    embed: new MessageEmbed()
      .setTitle(`◜ Quais joguinhos? ◞`),
    roles: [
      { name: 'Fortnite', emoji: '🔫', id: '963836208641880115' },
      { name: 'Minecraft', emoji: '⛏', id: '963836053477810246' },
      { name: 'Genshin Impact', emoji: '🍤', id: '963835843657728090' },
      { name: 'Lolzeiro', emoji: '🐮', id: '963835939183034438' },
      { name: 'Sky', emoji: '☁️', id: '963835713315536988' },
    ]
  },
  {
    embed: new MessageEmbed()
      .setTitle(`◜ Caso você se interesse... ◞`),
    roles: [
      { name: 'Reviver chat', emoji: '☠️', id: '963832400016703598' },
      { name: 'Eventos', emoji: '🎉', id: '963832210186715156' },
    ]
  },
  {
    embed: new MessageEmbed()
      .setTitle(`◜ Tchau tchau! ◞`)
      .setImage("https://i.ibb.co/QXPSJK8/elma-002.gif")
  }
];
module.exports['embeds'] = embeds;

exports.run = async (client, message) => {
  try {
    const channel = await message.guild.channels.fetch('962775354169245788');

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
          client.db.set(`reactionRoles.register`, embeds);
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

    message.reply("Registro construído com sucesso.").then(msg => {
      setTimeout(() => {
        message.delete();
        msg.delete();
      }, 5000);
    });
  } catch (err) {
    console.error(err);
    message.reply(`Falha ao construir registro. Por favor, verifique o console!`).then(msg => {
      setTimeout(() => {
        message.delete();
        msg.delete();
      }, 5000);
    });
  }
}