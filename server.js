const { DateTime } = require('luxon');

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports.api = {url: `https://chaos-web.vercel.app/api`};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const express = require('express');
const app = express();

let client;
let initialized = false;

app.get('/', (req, res) => {
	console.log(
		'[SERVER]',
		`Request registrada às ${DateTime.now()
			.setLocale('pt-BR')
			.setZone('America/Sao_Paulo')
			.toFormat('HH:mm:ss.S')} (${req.headers['x-forwarded-for']})`
	);

	res.send(
		client
			? {
					commands: client.realCommands.forEach((cmd) => cmd),
					invite: client.invite,
					creators: client.creators,
					id: client.user.id,
          guilds: client.guilds.cache.size || 0,
          users: client.users.cache.size || 0,
          emojis: client.emojis.cache.size || 0,
          commands: client.realCommands.size,
			  }
			: { err: { message: 'Client not initialized', code: 1000 } }
	);
});

const PORT = process.env.PORT || 3000;

module.exports.PORT = PORT;

module.exports.start = (ur_client) => {
	ur_client ? (client = ur_client) : null;
	if (!initialized)
		app.listen(PORT, () => {
			console.log(
				'[SERVER]',
				`Online na porta ${PORT} // https://elma-bot.mkishereoficial.repl.co/`
			);
			initialized = true;
		});
};