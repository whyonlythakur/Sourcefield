require('dotenv').config();
const { getSupabase } = require('./utils/supabase');
const { createBot } = require('./bot');

async function main() {
  try {
    const supabase = getSupabase();
    
    // Test Supabase connection
    const { data, error } = await supabase.from('guilds').select('count').limit(1);
    if (error) {
      if (error.code === 'PGRST110') {
        console.log('[DB] Supabase connected (table not found - will create on first use)');
      } else {
        throw error;
      }
    } else {
      console.log('[DB] Supabase connected');
    }

    const bot = createBot();
    await bot.login(process.env.DISCORD_TOKEN);
    console.log('[Bot] Logged in as', bot.user.tag);
  } catch (err) {
    console.error('[FATAL] Startup failed:', err.message);
    process.exit(1);
  }
}

main();