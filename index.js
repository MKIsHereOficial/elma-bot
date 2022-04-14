require('dotenv').config();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const Discord = require('discord.js');
const { Intents } = Discord;

const client = new Discord.Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
	],
  partials: ['REACTION', 'MESSAGE', 'USER', 'GUILD_MEMBER']
});

const fs = require('fs');

const luxon = require('luxon');

const server = require('./server');

const handlers = require('./utils/handlers');

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

client.config = {
	DEFAULT_PREFIX: 'only / commands, no prefix.',
	DEFAULT_LANG: 'pt-BR',
	colors: {
		spearmint: '#85D2D0',
		rose: '#F4B9B8',
		yellow: '#FFF4BD',
		purple: '#887BB0',
		invisible: '#2f3136',
		primary: '#9b4fff',
		green: '#4fff5d',
		red: '#ff724f',
    palette: [
      '#ABAB0A',
      '#C4C411',
      '#D1D110',
      '#E3E31F',
      '#DAF323',
    ],
	},
};


client.db = require('./utils/database');

client.commandCooldown = new Discord.Collection();
client.realCommands = new Discord.Collection();
client.commands = new Discord.Collection();

const startedAt = luxon.DateTime.now();
client.startedAt = startedAt;

client.creators = ['852948164977098753'];

client.host =
	process.env.NODE_ENV != 'development'
		? { name: 'Repl.it', url: 'https://replit.com/' }
		: { name: 'Repl.it VE[10]' };

client.isReady = true;

console.warn('Default Prefix: ' + client.config.DEFAULT_PREFIX);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

{
  client.getServerCount = async () => {
    if (client.shard) {
      // get guild collection size from all the shards
      const req = await client.shard.fetchClientValues('guilds.cache.size');

      // return the added value
      return req.reduce((p, n) => p + n, 0);
    } else {
      return client.guilds.cache.size;
    }
  };

  client.getUsers = async () => {
    if (client.shard) {
      const req = await client.shard.fetchClientValues('users.cache');
      const users = [];

      req.map((cache) => {
        cache.map((user) => {
          if (!users.find((u) => u.id === user.id)) users.push(user);
        });
      });

      return users;
    } else {
      const cache = client.users.cache;
      const users = [];

      cache.map((user) => {
        if (!users.find((u) => u.id === user.id)) users.push(user);
      });

      return users;
    }
  };

  client.getUsersCount = async () => {
    const req = await client.getUsers();

    return req.length || client.users.cache.size || 0;
  };

  client.getEmojisCache = async () => {
    if (client.shards) {
      const req = await client.shard.fetchClientValues('emojis.cache');
      const emojis = new Discord.Collection();

      req.map((cache) => {
        cache.map((emoji) => {
          if (emoji && emoji.id && !emojis.find((e) => e.id === emoji.id))
            emojis.set(emoji.id, emoji);
          if (emoji && emoji.name && !emojis.find((e) => e.name === emoji.name))
            emojis.set(emoji.name, emoji);
        });
      });

      return emojis;
    } else {
      return client.emojis.cache;
    }
  };
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

handlers.loadEvents(client);

handlers.loadCommands(client);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

client.on('ready', () => {
	server.start(client);
}); 

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

server.start();
console.log(client.login(process.env.TOKEN));

process.on('beforeExit', () => {
  client.destroy();
});

('~ by MinnaTheQueen, with love');
