# AutoMod Pro — Setup Guide

## Prerequisites

- Node.js 20+
- PostgreSQL database (Supabase recommended)
- Redis (optional, for rate limiting and spam detection)
- Discord Bot Token

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/whyonlythakur/AutoMod-Pro.git
cd AutoMod-Pro
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Go to [Supabase](https://supabase.com) and create a new project
2. Go to SQL Editor and run the schema from `database/supabase_schema.sql`
3. Get your credentials:
   - `SUPABASE_URL` (found in Settings → API)
   - `SUPABASE_SERVICE_KEY` (found in Settings → API)

### 4. Set Up Discord Bot

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Go to Bot section and create a bot
4. Copy the bot token
5. Enable these Privileged Gateway Intents:
   - Server Members Intent
   - Message Content Intent
6. Go to OAuth2 → URL Generator and select:
   - Scopes: `bot`, `applications.commands`
   - Bot Permissions: Administrator (or specific permissions)
7. Use the generated URL to invite the bot to your server

### 5. Set Up Discord OAuth2 (for Dashboard)

1. In Discord Developer Portal, go to OAuth2 → General
2. Add redirect URI: `http://localhost:3000/api/auth/discord/callback` (for development)
3. Copy Client ID and Client Secret

### 6. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Discord Bot
DISCORD_TOKEN=your_bot_token_here
DISCORD_CLIENT_ID=your_client_id
DISCORD_CLIENT_SECRET=your_client_secret

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key

# Redis (optional)
REDIS_URL=redis://localhost:6379

# NextAuth (for dashboard)
NEXTAUTH_SECRET=generate_random_secret_here
NEXTAUTH_URL=http://localhost:3000
```

Generate a secure NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

### 7. Set Up Dashboard Environment

Create a `.env` file in the `dashboard` directory:

```env
# NextAuth
NEXTAUTH_SECRET=same_secret_as_above
NEXTAUTH_URL=http://localhost:3000

# Discord OAuth2
DISCORD_CLIENT_ID=same_as_above
DISCORD_CLIENT_SECRET=same_as_above

# Supabase
SUPABASE_URL=same_as_above
SUPABASE_SERVICE_KEY=same_as_above
NEXT_PUBLIC_SUPABASE_URL=same_as_above
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_from_supabase
```

### 8. Register Slash Commands

```bash
npm run register
```

### 9. Start the Bot

**Single instance (for testing):**
```bash
npm start
```

**With sharding (for production):**
```bash
npm run shard
```

### 10. Start the Dashboard

```bash
cd dashboard
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

## Verification

### Bot is Running

Check console for:
```
[DB] Supabase connected
[Bot] Logged in as AutoMod Pro#1234
```

### Dashboard is Running

Open http://localhost:3000 and verify:
- Login with Discord button appears
- After login, you can select a server

### Test Basic Functionality

1. In Discord, type `/` and verify commands appear
2. Try `/staff add @user admin` to add a staff member
3. Try `/warn @user reason` to test moderation
4. Send spam messages to test automod

## Troubleshooting

### Bot Won't Start

- Verify Discord token is correct
- Check Supabase credentials
- Ensure all intents are enabled in Discord Developer Portal

### Commands Don't Appear

- Run `npm run register` again
- Wait up to 1 hour for global commands to propagate
- Try kicking and re-inviting the bot

### Dashboard Can't Connect

- Verify all environment variables are set correctly
- Check that NEXTAUTH_SECRET matches between bot and dashboard
- Ensure Discord OAuth2 redirect URI is correct

### Supabase Errors

- Verify schema was run correctly
- Check that SUPABASE_SERVICE_KEY is correct (not anon key)
- Ensure tables exist: `guilds`, `cases`, `users`, `reports`

## Production Deployment

### Bot Deployment

1. Use a VPS or cloud provider (Heroku, Railway, Render, etc.)
2. Set environment variables in your hosting platform
3. Use `npm run shard` for sharding support
4. Enable PM2 or similar process manager

### Dashboard Deployment

1. Build the dashboard: `npm run build`
2. Start with `npm start`
3. Use a reverse proxy (nginx, Caddy) for HTTPS
4. Set `NEXTAUTH_URL` to your production domain

### Database

1. Use production Supabase plan for large guild counts
2. Enable Row Level Security (RLS) for additional security
3. Set up database backups

## Next Steps

- Read [MODULES.md](./MODULES.md) for module configuration
- Read [COMMANDS.md](./COMMANDS.md) for command reference
- Read [DASHBOARD.md](./DASHBOARD.md) for dashboard guide
- Join support server for help