require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { getSupabase } = require('./utils/supabase');

function createBot() {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildModeration,
    ],
  });

  client.commands = new Collection();
  client.modules = new Collection();

  // Load all modules
  const moduleFiles = require('./modules');
  Object.entries(moduleFiles).forEach(([name, mod]) => {
    if (mod.execute) {
      client.modules.set(name, mod);
    }
  });

  // Load all commands
  const commandFiles = require('./commands');
  Object.entries(commandFiles).forEach(([name, cmd]) => {
    if (cmd.data && cmd.execute) {
      client.commands.set(name, cmd);
    }
  });

  // Load event handlers
  const eventFiles = require('./events');
  Object.entries(eventFiles).forEach(([name, handler]) => {
    if (handler) {
      client.on(name, handler);
    }
  });

  // Graceful shutdown for shards
  process.on('SIGINT', async () => {
    console.log(`[Shard ${client.shard?.ids?.[0] || 0}] Received SIGINT, cleaning up...`);
    await client.destroy();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log(`[Shard ${client.shard?.ids?.[0] || 0}] Received SIGTERM, cleaning up...`);
    await client.destroy();
    process.exit(0);
  });

  return client;
}

module.exports = { createBot };