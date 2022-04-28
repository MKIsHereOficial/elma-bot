const { MessageEmbed, MessageActionRow } = require('discord.js');

exports.run = async ({ client, interaction , options }) => {
  let optionCmd = options.getString('cmd') ? options.getString('cmd').toLowerCase() : null;

  let cmds = [];
  let sections = [
    {
      id: 'home', 
      emoji: '🏠',
      name: 'Inicio',
      text: `
Olá! É um prazer, eu sou a **Elma**. Aqui estão algumas categorias minhas, e se quiser mais ajuda pode reutilizar o comando com a opção "cmd" ou chamar o suporte!

Categorias:
`
    },
    {
      id: 'util',
      emoji: '💫',
      name: 'Utilidades'
    },
    {
      id: 'fun',
      emoji: '🍻',
      name: 'Diversão'
    }
];

  let sectionIndex = 0;
  
  client.realCommands.forEach(cmd => {
    if (!cmd.help.hidden) cmds.push(cmd);
  });


  let embed = new MessageEmbed()
    .setDescription(sections[sectionIndex].text)
    .setFooter({text: `Comando emitido por: ${interaction.user.tag} (${interaction.user.id})`})
    .setColor(client.config.colors.invisible)
    .setTimestamp();

  ////////////////////////////////////////////////////////////////
  let actionRowOne = new MessageActionRow();

  actionRowOne.addComponents({
    type: 'SELECT_MENU',
    customId: `${interaction.user.id}_${interaction.id}_help.category`,
    placeholder: 'Escolha uma categoria',
    options: (() => {
      let arr = [];
      sections.map(section => {
        if (section && section['name']) {
          arr.push({
            value: section.id,
            label: section.name,
            emoji: section.emoji,
          })
        }
      });

      return arr;
    })()
  })
  
  ////////////////////////////////////////////////////////////////
  let defaultMessageOptions = { embeds: [embed], components: [actionRowOne] };
  
  if (!optionCmd) {
      
    sections.map(section => {
      if (section['id'] && section['id'] !== "home") {
        let sectionCmds = [];
        cmds.map(cmd => {
          if (cmd['help']['subcommand']) {
            console.log(cmd['slash']['options']);
            cmd['slash']['options'].map(option => {
              if (option['description'] && option['description'].startsWith(`◜${section.emoji} ${section.name}◞`)) sectionCmds.push({ help: { name: `${cmd['help']['name']} ${option.name}`, description: option.description }, slash: {  name: option.name, description: option.description } });
            })
          };
          if (cmd['help']['section'] === section['id']) sectionCmds.push(cmd);
        });
        
        sections[0].text += 
  `> \`◜${section.emoji} ${section.name}◞\`\n`;
      embed.setDescription(sections[sectionIndex].text)
  
        sections[sections.indexOf(section)]['text'] = `
  Informações da categoria \`◜${section.emoji} ${section.name}◞\`!
  
  ${ (sections[sections.indexOf(section)]['manut'] || sectionCmds.length < 1) ? 'Nenhum comando disponível na categoria. Ela pode estar em manutenção!': 'Comandos:'}
        `;
        
        sectionCmds.map(cmd => {
          sections[sections.indexOf(section)]['text'] +=
  `> ${cmd.help.name}
  `;
        });
      }
    });
  
    function changeSection(index) {
      sectionIndex = index;
      embed.setDescription(sections[sectionIndex].text || `Categoria indisponível.`);
      defaultMessageOptions.embeds[0] = embed;
      interaction.editReply(defaultMessageOptions);
    }
    
    interaction.reply(defaultMessageOptions);
  
    client.on('interactionCreate', async (int) => {
      if (!int.isMessageComponent()) return;
  
      if (int.customId != `${int.user.id}_${interaction.id}_help.category`) return;
  
      int.reply({ content: 'Interação concluída', fetchReply: true }).then(rep => {
        rep.delete();
        changeSection(sections.findIndex(s => s.id === int.values[0]));
      });
    })
  } else {
    cmds = [];
    client.realCommands.forEach(c => {
      cmds.push(c);
    });
    let cmd = cmds.find(c => c['help']['name'] === optionCmd || c['help']['name'] === optionCmd.split(" ")[0] );

    if (cmd['help']['subcommand']) {
      let section = sections.find(s => s['id'] === cmd['help']['section']) || null;
       
      let option = cmd['slash']['options'].find(o => o.name === optionCmd.split(" ")[1]);
      cmd = { help: { name: `${cmd['help']['name']} ${option.name}`, description: option.description }, slash: {  name: option.name, description: option.description } }

      if (!cmd) return interaction.reply({ content: `Esse comando não foi encontrado!` });
    
      embed = new MessageEmbed()
        .setDescription(
`
**${cmd['help']['name']}**
${section ? `Comando da categoria \`◜${section.emoji} ${section.name}◞\`\n` : ""}
${cmd['help']['description'] ? `Descrição: ${cmd['help']['description']}
` : `Descrição:
> ${cmd['slash']['description']}
`}
`
        )
       .setFooter({text: `Comando emitido por: ${interaction.user.tag} (${interaction.user.id})`})
        .setColor(client.config.colors.invisible)
       .setTimestamp();
    } else {
      let section = sections.find(s => s['id'] === cmd['help']['section']) || null;

      if (!cmd) return interaction.reply({ content: `Esse comando não foi encontrado!` });
    
      embed = new MessageEmbed()
       .setDescription(
`
**${cmd['help']['name']}**
${section ? `Comando da categoria \`◜${section.emoji} ${section.name}◞\`\n` : ""}
${cmd['help']['description'] ? `Descrição: ${cmd['help']['description']}
` : `Descrição:
> ${cmd['slash']['description']}
`}
`
        )
        .setFooter({text: `Comando emitido por: ${interaction.user.tag} (${interaction.user.id})`})
        .setColor(client.config.colors.invisible)
        .setTimestamp();
    }

    
    defaultMessageOptions = { embeds: [embed] };
    
    interaction.reply(defaultMessageOptions);
  }
}

exports.help = {
  name: 'ajuda',
  hidden: true,
}

const { SlashCommandBuilder, SlashCommandStringOption } = require('@discordjs/builders');

exports.slash = new SlashCommandBuilder()
  .setName('ajuda')
  .setDescription('◜💫 Utilidades◞ ― Consiga ajuda avançada pra qualquer comando.')
  .addStringOption(
    new SlashCommandStringOption()
      .setName('cmd')
      .setDescription('Nome do comando (pra receber ajuda especifica)')
  );