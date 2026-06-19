require('dotenv').config();
const mongoose = require('mongoose');
const { createBot } = require('./bot');
const { connectRedis } = require('./utils/redis');
const config = require('./config');

async function main() {
  try {
    await mongoose.connect(config.mongodbUri);
    console.log('[DB] MongoDB connected');

    const redisClient = await connectRedis();
    console.log('[Cache] Redis connected');

    const bot = createBot(redisClient);
    await bot.login(config.discordToken);
    console.log('[Bot] Logged in as', bot.user.tag);
  } catch (err) {
    console.error('[FATAL] Startup failed:', err);
    process.exit(1);
  }
}

main();
