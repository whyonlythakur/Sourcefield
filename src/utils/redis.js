const Redis = require('ioredis');
const config = require('../config');

let redisClient = null;

async function connectRedis() {
  if (redisClient) return redisClient;

  redisClient = new Redis(config.redisUrl, {
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
      const delay = Math.min(times * 200, 2000);
      return delay;
    },
  });

  redisClient.on('error', (err) => console.error('[Redis] Error:', err.message));
  redisClient.on('connect', () => console.log('[Redis] Connected'));

  return redisClient;
}

function getRedis() {
  return redisClient;
}

module.exports = { connectRedis, getRedis };
