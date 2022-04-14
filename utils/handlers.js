/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Packages
const _chalk = require('chalk'), chalk = new _chalk.Instance(); 
const Discord = require('discord.js');

// Libs
const fs = require('fs'), path = require('path');

// CustomPackages
const { div } = require('./console');

const commandsDir = path.join(__dirname, '..', 'commands'), eventsDir = path.join(__dirname, '..', 'events');

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const version = '0.1'; // Versão do "HANDLERS.JS"

function loadCommands(client = new Discord.Client()) { // Função que inicializa os comandos no Bot
  const cmdsFolder = fs.readdirSync(commandsDir); // Lendo a pasta com os comandos.

  
  div();
  var index = 0;
  console.log(`Carregando comandos...`, `[${index}/${cmdsFolder.length}]`);

  cmdsFolder.map(fileName => {
    if (!fileName.endsWith('.js')) return; // Caso o arquivo do comando não seja Javascript/NodeJS, a função simplesmente ignora o mesmo.

    let cmdName = fileName.split('.')[0];

    try {
      const file = require(path.join(commandsDir, fileName));

      if (!file.run) return;

      if (file.help) {
        if (file.help.name) cmdName = file.help.name;
        
        if (file.help.aliases) {
          const aliases = file.help.aliases;

          aliases.map(name => {
            client.commands.set(name, file);
          })
        }
      }

      client.commands.set(cmdName, file); // Isso é para execução do comando, ele ficará guardado num tipo de "Banco de Dados" que só existe enquanto o bot está on.

      client.realCommands.set(cmdName, file); // Isso é para o comando HELP, pois se usar o commands normal o mesmo irá ficar bugado.

      index++;
      console.log(`Comando "${cmdName}" carregado.`, `[${index}/${cmdsFolder.length}]`);
    } catch (err) {
      console.log(`Comando "${cmdName}" não pôde ser carregado.`, `[${index}/${cmdsFolder.length}]`);
      console.error(err);
    }
  });


  console.log(`${index} comandos foram carregados com sucesso.`);
  div();

}

function loadEvents(client) { // Função que inicializa os eventos do Bot, disponíveis na pasta "events"
  const eventsFolder = fs.readdirSync(eventsDir); // Lendo a pasta com os eventos.

  div();
  var index = 0;
  console.log(`Carregando eventos...`, `[${index}/${eventsFolder.length}]`);

  eventsFolder.map(fileName => {
    if (!fileName.endsWith('.js')) return; // Caso o arquivo do comando não seja Javascript/NodeJS, a função simplesmente ignora o mesmo.

    const eventName = fileName.split('.')[0];

    try {
      const event = require(path.join(eventsDir, fileName));

      client.on((event['data'] && event['data']['name']) ? event['data']['name'] : eventName, event.run.bind(null, client));

      index++;
      console.log(`Evento "${eventName}" carregado.`, `[${index}/${eventsFolder.length}]`);
    } catch (err) {
      console.log(`Evento "${eventName}" não pôde ser carregado.`, `[${index}/${eventsFolder.length}]`);
      console.error(err);
    }
  });

  console.log(`${index} eventos foram carregados com sucesso.`);
  div();
}

module.exports = {
  loadCommands, loadEvents, version
}