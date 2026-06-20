const Redis = require('ioredis');
const config = require('../config');

let redisClient = null;
let redisAvailable = false;

async function connectRedis() {
  if (redisClient) return redisClient;

  try {
    redisClient = new Redis(config.redisUrl, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        if (times > 3) {
          console.warn('[Redis] Max retries reached, continuing without Redis');
          return null;
        }
        const delay = Math.min(times * 200, 2000);
        return delay;
      },
    });

    redisClient.on('error', (err) => {
      console.error('[Redis] Error:', err.message);
      redisAvailable = false;
    });

    redisClient.on('connect', () => {
      console.log('[Redis] Connected');
      redisAvailable = true;
    });

    redisClient.on('ready', () => {
      console.log('[Redis] Ready');
      redisAvailable = true;
    });

    await redisClient.ping();
    return redisClient;
  } catch (err) {
    console.warn('[Redis] Failed to connect, continuing without Redis:', err.message);
    console.warn('[Redis] Some features (spam detection, raid detection, duplicate detection) will be limited');
    redisAvailable = false;
    return null;
  }
}

function getRedis() {
  return redisClient;
}

function isRedisAvailable() {
  return redisAvailable && redisClient !== null;
}

module.exports = { connectRedis, getRedis, isRedisAvailable };