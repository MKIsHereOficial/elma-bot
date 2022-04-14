exports.run = async (client, reaction, user) => {
  if (user.bot || !reaction.message.guild) return;
  if (!(await client.db.get(`reactionRoles.register`))) return;

  const obj = (await client.db.get(`reactionRoles.register`)).find(e => e.id === reaction.message.id);

  if (!obj) return;
  const guild = reaction.message.guild;
  const member = await guild.members.fetch(user.id);

  const role = obj.roles.find(r => r.emoji === reaction.emoji.name);
  
  member.roles.remove(role.id);
}