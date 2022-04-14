//const { ApplicationCommandsManager } = require("../utils/slash");

/**
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').CommandInteraction} interaction
 */
exports.run = async (client, interaction) => {
  if (!interaction || !interaction.isCommand()) return;

  //const slash = new ApplicationCommandsManager();

  const cmdName = interaction.commandName;
  const cmdOptions = interaction.options;

  const cmd = client.commands.get(cmdName);

  if (!cmd) return;
  
  console.log(`[SLASH-COMMANDS]`, `Comando "${cmdName}" utilizado no servidor ${interaction.guild.name} (${interaction.guildId})`);

  if (cmd['help']['onlyDevs'] && interaction.guildId != "832744616154365982") return interaction.reply({ ephemeral: true, content: `Esse comando está bloqueado fora do servidor de desenvolvimento.` });

  if (cmd['help']['perms'] && Array.isArray(cmd['help']['perms']) && !interaction.memberPermissions.has(cmd['perms'])) return await interaction.reply({ content: 'Você não possui as permissãos necessárias para utiizar este comando.', ephemeral: true });


  return await cmd.run({ slash: true, client, options: cmdOptions, interaction }).catch(err => {
    console.log('[SLASH-COMMANDS]', `Um erro ocorreu ao executar o comando ${cmdName}`);
    console.error(err);
    return interaction.reply({ ephemeral: true, content: 'Sinto muito, um erro ocorreu ao executar este comando. Tente novamente mais tarde.' }).catch(console.error);
  });
}