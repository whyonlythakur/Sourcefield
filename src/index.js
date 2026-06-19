require('dotenv').config();
const mongoose = require('mongoose');
const { createBot } = require('./bot');
const { connectRedis } = require('./utils/redis');
const config = require('./config');

function validateConfig() {
  const errors = [];
  if (!config.discordToken || config.discordToken === 'your-bot-token-here') {
    errors.push('DISCORD_TOKEN is not set');
  }
  if (!config.mongodbUri || config.mongodbUri.includes('username:password')) {
    errors.push('MONGODB_URI is not configured (MongoDB Atlas connection string required)');
  }
  if (!config.redisUrl || config.redisUrl.includes('your-redis-password')) {
    errors.push('REDIS_URL is not configured (Redis Cloud connection string required)');
  }
  if (!config.botOwnerIds || config.botOwnerIds.length === 0) {
    errors.push('BOT_OWNER_IDS is not set (add your Discord user ID)');
  }

  if (errors.length > 0) {
    console.error('[CONFIG] Validation errors:');
    errors.forEach(e => console.error(`  - ${e}`));
    console.error('\nPlease copy .env.example to .env and fill in the values.');
    process.exit(1);
  }
}

async function main() {
  validateConfig();

  const shutdown = async (signal) => {
    console.log(`\n[Shutdown] Received ${signal}, cleaning up...`);
    try {
      await mongoose.connection.close();
      console.log('[DB] MongoDB disconnected');
    } catch (err) {
      console.error('[DB] Error disconnecting:', err.message);
    }
    process.exit(0);
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));

  try {
    await mongoose.connect(config.mongodbUri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('[DB] MongoDB connected to', mongoose.connection.name);

    const redisClient = await connectRedis();
    console.log('[Cache] Redis connected');

    const bot = createBot(redisClient);
    await bot.login(config.discordToken);
    console.log('[Bot] Logged in as', bot.user.tag);
  } catch (err) {
    console.error('[FATAL] Startup failed:', err.message);
    process.exit(1);
  }
}

main();