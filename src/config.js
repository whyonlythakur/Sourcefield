function requireEnv(key) {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required env var: ${key}`);
  return val;
}

module.exports = {
  discordToken: requireEnv('DISCORD_TOKEN'),
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/automod-pro',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  botOwnerIds: (process.env.BOT_OWNER_IDS || '').split(',').filter(Boolean),
  dashboardUrl: process.env.DASHBOARD_URL || 'http://localhost:3000',
  sessionSecret: process.env.SESSION_SECRET || 'change-me-in-production',
  discordClientId: process.env.DISCORD_CLIENT_ID || '',
  discordClientSecret: process.env.DISCORD_CLIENT_SECRET || '',
};
