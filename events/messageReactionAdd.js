exports.run = async (client, reaction, user) => {
	if (user.bot || !reaction.message.guild) return;

	async function hasReactionRoles() {
		if (typeof (await client.db.get(`reactionRoles.register`)) === "undefined" ) { return false; }
    		let register = (await client.db.get(`reactionRoles.register`)).find((e) => e.id === reaction.message.id);
    		if (typeof (await client.db.get(`reactionRoles.colors`)) === "undefined") { return false; }
    		let colors = (await client.db.get(`reactionRoles.colors`)).find((e) => e.id === reaction.message.id);

    		return (register || colors) ? register || colors : false;
	}

  	if (!(await hasReactionRoles())) return;

	const obj = await hasReactionRoles();

	if (!obj) return;
	const guild = reaction.message.guild;
	const member = await guild.members.fetch(user.id);

	let role = obj.roles.find((r) => r.emoji === reaction.emoji.name);
	role = await guild.roles.fetch(role.id);

	try {
		await member.roles.add(role.id);
  		return console.log(`[REACTION_ROLES]`, `${member.displayName} (${user.id}) pegou o cargo "${role.name}"`);
	} catch (err) {
		console.log(`[REACTION_ROLES]`, `não foi possível dar o cargo "${role.name}" para ${user.tag} (${user.id})`);
		return console.error(err);
	}  	
};
