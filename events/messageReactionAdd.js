exports.run = async (client, reaction, user) => {
  if (user.bot || !reaction.message.guild) return;
  
  const obj = (await client.db.get(`reactionRoles.register`)).find(e => e.id === reaction.message.id);

  const guild = reaction.message.guild;
  const member = await guild.members.fetch(user.id);

  const role = obj.roles.find(r => r.emoji === reaction.emoji.name);
  
  member.roles.add(role.id);
}