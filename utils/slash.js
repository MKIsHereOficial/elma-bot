const EventEmitter = require('events')

const { REST } = require(`@discordjs/rest`);
const { Routes } = require(`discord-api-types/v9`);

const rest = new REST({ version: `9` }).setToken(process.env.TOKEN);

let lastCommandsGet = { global: [], guilds: {} };

class ApplicationCommandsManager extends EventEmitter {  
  hasInitiated = false;

  /**
   * @param {{ client: import('discord.js').Client }} options
   */
  constructor(options = { client }) {
    super();

    this.commands = [];
    options['client'].realCommands.forEach(cmd => {
      this.commands.push({
        name: cmd['slash']['name'], 
        description: cmd['slash']['description'], 
        options: cmd['slash']['options'], 
        defaultPermission: cmd['slash']['defaultPermission']
      });
    });
    
    this.clientId = options['client'].user.id;

    this.hasInitiated = true;
    this.emit("ready", { clientId: this.clientId, commands: this.commands });
  }

  get lastGet() {
    return lastCommandsGet;
  }

  set lastGet(value) {
    lastCommandsGet = value;
    return lastCommandsGet;
  }

  async register() {
    console.log(this.commands)
    try {
      console.log(`Started refreshing application (/) commands.`);

      const data = await rest.put(
        Routes.applicationCommands(this.clientId),
        { body: this.commands },
      );

      console.log(`Successfully reloaded application (/) commands.`);
      this.emit("commandsRegister", { global: true, data });

      return data;
    } catch (err) {
      console.log(err.rawError?.errors?.name);
      console.error(err);
      return err;
    }
  }

  async guildRegister(guildId) {
    try {
      console.log(`Started refreshing application (/) commands for guild ${guildId}.`);

      const data = await rest.put(
        Routes.applicationGuildCommands(this.clientId, guildId),
        { body: this.commands },
      );

      console.log(`Successfully reloaded application (/) commands for guild ${guildId}.`);
      this.emit("commandsRegister", { data });

      return data;
    } catch (err) {
      console.log(err.rawError?.errors?.name)
      console.error(err);
      return err;
    }
  }

  async getCommands() {
    const data = await rest.get(Routes.applicationCommands(this.clientId));
    
    this.lastGet = {...this.lastGet, global: data};
    this.emit("commandsGet", { global: true, data });

    return data;
  }

  async getGuildCommands(guildId) {
    const data = await rest.get(Routes.applicationGuildCommands(this.clientId, guildId));
    
    this.lastGet[guildId] = data;
    this.emit("commandsGet", { data });

    return data;
  }

  async deleteCommand(cmdId) {
    try {
      console.log(`Deleting (/) command`);

      const data = await rest.delete(
        Routes.applicationCommand(this.clientId, cmdId)
      )

      console.log(`Sucessfully deleted (/) command`);
      this.emit("commandsDelete", { global: true, data });

      return data;
    } catch (err) {
      console.error(err);
      return err;
    }
  }

  async deleteGuildCommand(guildId, cmdId) {
    try {
      console.log(`Deleting (/) command for guild ${guildId}`);

      const data = await rest.delete(
        Routes.applicationGuildCommand(this.clientId, guildId, cmdId)
      )

      console.log(`Sucessfully deleted (/) command for guild ${guildId}`);
      this.emit("commandsDelete", { data });

      return data;
    } catch (err) {
      console.error(err);
      return err;
    }
  }
}

module.exports = {
  ApplicationCommandsManager
};