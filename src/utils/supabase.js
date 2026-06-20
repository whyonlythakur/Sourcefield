const { createClient } = require('@supabase/supabase-js');
const config = require('../config');

let supabase = null;

function getSupabase() {
  if (!supabase) {
    if (!config.supabaseUrl || !config.supabaseKey) {
      console.error('[Supabase] Missing SUPABASE_URL or SUPABASE_KEY in .env');
      process.exit(1);
    }
    
    supabase = createClient(config.supabaseUrl, config.supabaseKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: false,
      },
    });
  }
  return supabase;
}

module.exports = { getSupabase };