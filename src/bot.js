const { Client, GatewayIntentBits, Partials } = require('discord.js');
const { loadCommands } = require('./commands');
const { loadEvents } = require('./events');
const Guild = require('./models/Guild');

function createBot() {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMessageReactions,
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
  });

  client.db = {
    Guild,
    Case: require('./models/Case'),
    User: require('./models/User'),
    MediaCase: require('./models/MediaCase'),
  };
  client.modules = require('./modules');

  loadCommands(client);
  loadEvents(client);

  return client;
}

module.exports = { createBot };