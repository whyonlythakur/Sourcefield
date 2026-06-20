const config = require('../config');

module.exports = {
  discordToken: process.env.DISCORD_TOKEN,
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseKey: process.env.SUPABASE_KEY,
  botOwnerIds: (process.env.BOT_OWNER_IDS || '').split(',').filter(Boolean),
  dashboardUrl: process.env.DASHBOARD_URL || 'http://localhost:3000',
  sessionSecret: process.env.SESSION_SECRET || 'change-me-in-production',
  discordClientId: process.env.DISCORD_CLIENT_ID || '',
  discordClientSecret: process.env.DISCORD_CLIENT_SECRET || '',
};