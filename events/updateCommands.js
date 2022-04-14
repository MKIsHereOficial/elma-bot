exports.run = async (client) => {
  client.guilds.cache.map(guild => {
    client.emit('guildCreate', guild);
  })
}