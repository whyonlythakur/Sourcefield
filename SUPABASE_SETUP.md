# AutoMod Pro - Supabase Setup Guide

## Quick Start

### 1. Create Supabase Account
1. Go to https://supabase.com
2. Sign up for free
3. Create a new project

### 2. Get Your Credentials
1. Go to **Project Settings** (gear icon)
2. Click **API**
3. Copy:
   - **Project URL** → `SUPABASE_URL`
   - **anon public key** → `SUPABASE_KEY`

### 3. Set Up Database
1. Go to **SQL Editor** in Supabase dashboard
2. Copy the contents of `database/supabase_schema.sql`
3. Paste and run it
4. This creates all required tables!

### 4. Update .env File
Edit `.env` and add your credentials:
```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-anon-key-here
DISCORD_TOKEN=your-bot-token
```

### 5. Run the Bot
```bash
npm start
```

---

## Database Schema

The bot uses 4 tables:
- **guilds** - Server configurations
- **users** - User warn points and history
- **cases** - Moderation cases
- **media_cases** - Media review cases

All tables are automatically created when you run the schema SQL.

---

## Features Without MongoDB/Redis

✅ **What Works:**
- All 26 automod modules
- Punishment ladder system
- Case management
- Review queue
- All commands
- Persistent data (stored in Supabase)

⚠️ **Limitations:**
- Spam detection resets on bot restart (in-memory)
- Raid detection counters reset on restart
- Duplicate message detection limited to current session

---

## Testing

1. **Invite bot to your server**
2. **Test commands:**
   - `/staff add @user admin`
   - `/warn @user reason`
   - `/report @user reason`
3. **Test automod:**
   - Send multiple messages rapidly (spam detection)
   - Tag 5+ users (mass mention)
   - Post discord.gg links (invite filter)

---

## Troubleshooting

### "Missing SUPABASE_URL or SUPABASE_KEY"
✅ Fix: Check your `.env` file has the correct values

### "relation does not exist"
✅ Fix: Run the SQL schema in Supabase SQL Editor

### "permission denied"
✅ Fix: Make sure you're using the **anon** key, not the **service_role** key

---

## Next Steps

After testing:
1. ✅ Bot works with Supabase
2. ✅ All modules functional
3. ✅ Data persists across restarts
4. 📝 Ready for M4 (Dashboard)

---

**Current Version:** v3.1.0 (Supabase Edition)  
**Last Updated:** 2026-06-20