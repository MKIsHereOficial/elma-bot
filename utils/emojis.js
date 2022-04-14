const version = '0.2' // Versão

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const {Client} = require('discord.js');

async function getEmoji(emojiRef, client) {
  if (!client) return new Error("Não foi entregue um Client para a função.");
  const cache = await client.getEmojisCache();

  const byName = cache.find(e => e.name === emojiRef);
  const byId = cache.find(e => e.id === emojiRef);
  var emoji;

  if (byName) {
    emoji = byName;
  } else if (byId) {
    emoji = byId;
  } else {
    return emojiRef;
  }
  

  if (!emoji.animated) emoji = `<:${emoji.name}:${emoji.id}>`;
  if (emoji.animated) emoji = `<a:${emoji.name}:${emoji.id}>`


  return emoji;
}

module.exports = {
  getEmoji,
  version
}