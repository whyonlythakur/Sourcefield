const { Client, GatewayIntentBits, Partials } = require('discord.js');
const { loadCommands } = require('./commands');
const { loadEvents } = require('./events');

function createBot(redisClient) {
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

  client.redis = redisClient;

  loadCommands(client);
  loadEvents(client);

  return client;
}

module.exports = { createBot };
