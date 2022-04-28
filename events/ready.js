const random = require('random');

const { ApplicationCommandsManager } = require('../utils/slash');
const getUptime = require('../utils/uptime');

exports.run = async (client) => {
  const slash = new ApplicationCommandsManager({ client });

  const dbClient = require('../utils/database');


  //client.emit('updateCommands', client);
  console.log(await slash.getCommands('942638451080167465'));

	// Esse evento é usado assim que o bot é ligado e está pronto pra receber outros eventos.
	var index = 0;

	console.log(
		`${client.user.tag}: Client iniciado; ${client.users.cache.size} usuários e ${client.guilds.cache.size} servidores`
	);

	function setPresence() {
		const presences = [
			{ text: `Uptime: ${getUptime(client).formatted}` },
      { text: 'Utilizando apenas comandos /' },
		];
		index = random.int(0, presences.length - 1);
		var presence = 'Em desenvolvimento...';
		if (process.env.NODE_ENV != "development") presence = presences[index];

		client.user.setPresence({
			activities: [{
				name: `🍻 | ${presence['text'] || presence}`,
				type: presence['type'] ? presence['type'] : 'PLAYING',
			}],
		});
	}

	function activatePresence() {
		setPresence();
		if (process.env.NODE_ENV != "development") setInterval(setPresence, 5 * 1000);
	}

	if (client.isReady) {
		activatePresence();
	} else {
		var interval = setInterval(() => {
			if (client.isReady) {
				activatePresence();
				return clearInterval(interval);
			}
		}, 1000);
	}
};