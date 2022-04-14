const { ApplicationCommandsManager } = require('../utils/slash');

exports.run = async (client, guild) => {
  const slash = new ApplicationCommandsManager({ client });

  await slash.guildRegister(guild.id);
}