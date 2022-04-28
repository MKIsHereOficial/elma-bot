const { MessageEmbed, MessageAttachment } = require('discord.js');

const { DateTime } = require('luxon');

const random = require('random');

const ExtendedArrayFunctions = require('../utils/array');

exports.run = async ({ client, interaction , options }) => {
  let selectedCmd = options.getSubcommand(true);

  const fetch = (await import('node-fetch')).default;

  switch (selectedCmd) {
    case 'lista': {
      let description = ``;
      let embed = new MessageEmbed();
      let gameList = await (await fetch(`https://api.rawg.io/api/games?key=${process.env.GAMING_API_KEY}&page_size=${32}`)).json();
      
      let dayToday = [DateTime.local().toFormat(`dd`), DateTime.local().toFormat(`MM`), DateTime.local().toFormat(`yy`)].join('');
      let previousDay = [parseInt(DateTime.local().toFormat(`dd`)) - 1, DateTime.local().toFormat(`MM`), DateTime.local().toFormat(`yy`)].join('');


      if (await client.db.get(`games.${previousDay}.daily_recomendation`)) {
        await client.db.delete(`games.${previousDay}.daily_recomendation`);
      }

      if (!(await client.db.get(`games.${dayToday}.daily_recomendation`))) {
        let selectedGames = gameList.results; 
        
        selectedGames = ExtendedArrayFunctions.shuffle(selectedGames);
        selectedGames = ExtendedArrayFunctions.splitIntoChunk(selectedGames, 10);
        
        embed = new MessageEmbed()
          .setTitle(`Recomendados do dia`)
          .setDescription('...')
          .setColor(client.config.colors.invisible)
          .setFooter({ text: `Mostrando ${selectedGames[0].length} de ${gameList.results.length}`})
          .setTimestamp();

        selectedGames[0] = selectedGames[0].sort((a,b) => b.rating - a.rating);

        selectedGames[0].map(item => {
          description += `${selectedGames[0].indexOf(item) + 1}. \`${item.name}\` de <t:${Math.floor(new Date(item.released).getTime() / 1000)}:d> (<t:${Math.floor(new Date(item.released).getTime() / 1000)}:R>), com \`${item.rating}\` estrelas\n`;
          embed.setDescription(description);
        });

        await interaction.reply({ embeds: [embed] });

        await client.db.set(`games.${dayToday}.daily_recomendation`, selectedGames[0]);
      } else {
        let games = await client.db.get(`games.${dayToday}.daily_recomendation`);
        
        embed = new MessageEmbed()
          .setTitle(`Recomendados do dia`)
          .setDescription('...')
          .setColor(client.config.colors.invisible)
          .setFooter({ text: `Mostrando ${games.length} de ${gameList.results.length}` })
          .setTimestamp();


        games = games.sort((a,b) => b.rating - a.rating);

        games.map(item => {
          description += `${games.indexOf(item) + 1}. \`${item.name}\` de <t:${Math.floor(new Date(item.released).getTime() / 1000)}:d> (<t:${Math.floor(new Date(item.released).getTime() / 1000)}:R>), com \`${item.rating}\` estrelas\n`;
          embed.setDescription(description);
        });


        await interaction.reply({ embeds: [embed] });
      }
      break;
    }
    case 'recomendado': {
      let description = ``;
      let dayToday = [DateTime.local().toFormat(`dd`), DateTime.local().toFormat(`MM`), DateTime.local().toFormat(`yy`)].join('');
      let previousDay = [parseInt(DateTime.local().toFormat(`dd`)) - 1, DateTime.local().toFormat(`MM`), DateTime.local().toFormat(`yy`)].join('');


      if (await client.db.get(`games.${previousDay}.daily_recomendation`)) {
        await client.db.delete(`games.${previousDay}.daily_recomendation`);
      }

      if (!(await client.db.get(`games.${dayToday}.daily_recomendation`))) {
        
        let gameList = await (await fetch(`https://api.rawg.io/api/games?key=${process.env.GAMING_API_KEY}&page_size=${32}`)).json();
        let selectedGames = gameList.results; 
        
        selectedGames = ExtendedArrayFunctions.shuffle(selectedGames);
        selectedGames = ExtendedArrayFunctions.splitIntoChunk(selectedGames, 10);
        selectedGames = selectedGames.sort((a,b) => b.rating - a.rating);
        
        let game = selectedGames[0][random.int(0, selectedGames[0].length - 1)];

        let embed = new MessageEmbed()
          .setTitle(`Jogo recomendado Nº ${selectedGames.indexOf(game) + 1}`)
          .setDescription(`
Jogo: \`${game.name}\` de <t:${Math.floor(new Date(game.released).getTime() / 1000)}:d> (<t:${Math.floor(new Date(game.released).getTime() / 1000)}:R>)

Gêneros: \`${game.genres.map(item => {return item.name}).join(', ')}\`

Plataformas: \`${game.platforms.map(item => { return item.platform.name }).join(', ')}\`

Estrelas: \`${game.rating}\` :star:
Metacritic: \`${game.metacritic}\`
`         )
          .setImage(game.background_image)
          .setFooter({text: `Day ID: ${dayToday}`})
          .setColor(client.config.colors.invisible)
          .setTimestamp();

        await interaction.reply({ embeds: [embed] });

        await client.db.set(`games.${dayToday}.daily_recomendation`, selectedGames[0]);
      } else {

        let games = await client.db.get(`games.${dayToday}.daily_recomendation`);
        games = games.sort((a,b) => b.rating - a.rating);

        let game = games[random.int(0, games.length - 1)];

        let embed = new MessageEmbed()
          .setTitle(`Jogo recomendado Nº ${games.indexOf(game) + 1}`)
          .setDescription(`
Jogo: \`${game.name}\` de <t:${Math.floor(new Date(game.released).getTime() / 1000)}:d> (<t:${Math.floor(new Date(game.released).getTime() / 1000)}:R>)

Gêneros: \`${game.genres.map(item => {return item.name}).join(', ')}\`

Plataformas: \`${game.platforms.map(item => { return item.platform.name }).join(', ')}\`

Estrelas: \`${game.rating}\` :star:
Metacritic: \`${game.metacritic}\`
`         )
          .setImage(game.background_image)
          .setFooter({text: `Day ID: ${dayToday}`})
          .setColor(client.config.colors.invisible)
          .setTimestamp();

        await interaction.reply({ embeds: [embed] });
      }
      break;
    }
    default:
      break;
  }
}

exports.help = {
  name: 'jogos',
  subcommand: true,
}

const { SlashCommandBuilder, SlashCommandSubcommandBuilder } = require('@discordjs/builders');

exports.slash = new SlashCommandBuilder()
  .setName('jogos')
  .setDescription('◜🍻 Diversão◞ ― Categoria de jogos')
  .addSubcommand(
    new SlashCommandSubcommandBuilder()
      .setName('lista')
      .setDescription('◜🍻 Diversão◞ ― Veja a lista de jogos (por RAWG)')
  )
  .addSubcommand(
    new SlashCommandSubcommandBuilder()
      .setName('recomendado')
      .setDescription('◜🍻 Diversão◞ ― Veja com mais detalhes um dos jogos recomendados (aleatoriamente)')
  );