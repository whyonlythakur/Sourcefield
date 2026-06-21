# AutoMod Pro — Troubleshooting Guide

## Common Issues

### Bot Won't Start

**Error:** `Error [Invalid Token]: Provided bot token is invalid`

**Solution:**
1. Go to Discord Developer Portal → Bot
2. Click "Reset Token"
3. Copy the new token
4. Update `.env` file
5. Restart the bot

---

**Error:** `Error connecting to Supabase: ...`

**Solution:**
1. Verify `SUPABASE_URL` is correct (should be `https://xxxxx.supabase.co`)
2. Verify `SUPABASE_SERVICE_KEY` is correct (not the anon key)
3. Check that Supabase project is active
4. Run the schema SQL in Supabase SQL Editor

---

**Error:** `Error [IntentsDisallowed]: ...`

**Solution:**
1. Go to Discord Developer Portal → Bot → Privileged Gateway Intents
2. Enable:
   - Server Members Intent
   - Message Content Intent
3. Save changes
4. Restart the bot

---

### Commands Not Appearing

**Issue:** Slash commands don't show up when typing `/`

**Solution:**
1. Run `npm run register` to register commands
2. Wait up to 1 hour for global commands to propagate
3. Try kicking and re-inviting the bot
4. Check that bot has `applications.commands` scope

---

**Issue:** Commands appear but say "Application not responding"

**Solution:**
1. Ensure bot is online (check console for "Logged in as")
2. Check bot has required permissions
3. Verify event handlers are loaded (check console logs)

---

### Automod Not Working

**Issue:** Modules not triggering

**Solution:**
1. Check module is enabled: `/automod module [name] enable`
2. Verify threshold is appropriate for your server size
3. Check bot has permission to delete messages
4. Review logs for module execution errors

---

**Issue:** False positives

**Solution:**
1. Increase threshold: `/automod threshold [name] [higher value]`
2. Review confidence scoring in `src/utils/confidence.js`
3. Add trusted users to whitelist
4. Adjust module-specific settings

---

### Dashboard Issues

**Issue:** Can't login to dashboard

**Solution:**
1. Verify `DISCORD_CLIENT_ID` and `DISCORD_CLIENT_SECRET` are correct
2. Check redirect URI in Discord Developer Portal matches:
   - Dev: `http://localhost:3000/api/auth/discord/callback`
   - Prod: `https://yourdomain.com/api/auth/discord/callback`
3. Ensure `NEXTAUTH_SECRET` is set and matches between bot and dashboard
4. Check browser console for OAuth errors

---

**Issue:** Server not showing in select-server page

**Solution:**
1. Bot must be in the server
2. You must have "Manage Guild" or "Administrator" permission
3. Check API route `/api/guilds` returns your server
4. Verify Supabase connection is working

---

**Issue:** Changes in dashboard don't save

**Solution:**
1. Check browser console for API errors
2. Verify Supabase service key has write permissions
3. Check network tab for failed requests
4. Ensure `SUPABASE_SERVICE_KEY` is correct

---

**Issue:** Real-time updates not working

**Solution:**
1. Verify `NEXT_PUBLIC_SUPABASE_URL` is set (with `NEXT_PUBLIC_` prefix)
2. Check Supabase Realtime is enabled in project settings
3. Look for WebSocket connection errors in browser console
4. Ensure firewall isn't blocking WebSocket connections

---

### Database Issues

**Issue:** Table not found errors

**Solution:**
1. Run the schema SQL in Supabase SQL Editor
2. Verify all tables exist: `guilds`, `cases`, `users`, `reports`, `audit_log`
3. Check table names match exactly (case-sensitive)

---

**Issue:** Permission denied errors

**Solution:**
1. Use `SUPABASE_SERVICE_KEY` (not anon key) for server-side operations
2. Check Row Level Security (RLS) policies if enabled
3. Verify service role has necessary permissions

---

### Performance Issues

**Issue:** Bot is slow to respond

**Solution:**
1. Check Redis connection (if using)
2. Monitor Supabase query performance
3. Enable sharding for large guild counts: `npm run shard`
4. Check system resources (CPU, memory)

---

**Issue:** Dashboard is slow

**Solution:**
1. Enable production build: `npm run build && npm start`
2. Check Supabase query performance
3. Add database indexes for frequently queried columns
4. Consider caching with Redis

---

### Sharding Issues

**Issue:** Shards won't start

**Solution:**
1. Verify `DISCORD_TOKEN` is correct
2. Check `totalShards: 'auto'` is appropriate for guild count
3. Increase timeout if shards are slow to spawn
4. Check system has enough resources for multiple processes

---

**Issue:** Shards keep disconnecting

**Solution:**
1. Check Discord status (status.discord.com)
2. Verify internet connection is stable
3. Increase `timeout` in ShardingManager config
4. Enable debug logging to diagnose

---

### Redis Issues

**Issue:** Redis connection refused

**Solution:**
1. Start Redis server: `redis-server`
2. Verify `REDIS_URL` is correct
3. Check Redis is listening on correct port (default: 6379)
4. Test connection: `redis-cli ping`

---

**Issue:** Redis counters not persisting

**Solution:**
1. Ensure Redis is configured with persistence (RDB or AOF)
2. Check Redis memory usage isn't full
3. Verify Redis isn't in protected mode

---

## Debug Mode

Enable debug logging for troubleshooting:

```env
# In .env
DEBUG=true
LOG_LEVEL=debug
```

Check console for detailed logs.

---

## Getting Help

### Before Asking for Help

1. ✅ Check this troubleshooting guide
2. ✅ Review error logs in console
3. ✅ Check browser console (for dashboard issues)
4. ✅ Verify all environment variables are set
5. ✅ Try restarting the bot/dashboard

### When Asking for Help

Provide:
- Error message (full text)
- What you were trying to do
- What you've already tried
- Bot version (check `package.json`)
- Node.js version (`node --version`)
- Relevant configuration (redact secrets)

### Support Channels

- GitHub Issues: https://github.com/whyonlythakur/AutoMod-Pro/issues
- Discord Support Server: [invite link]
- Documentation: See other `.md` files in this directory

---

## Known Issues

### Global Command Propagation

Discord global commands can take up to 1 hour to propagate. If commands don't appear immediately after registration, wait or use guild-specific commands for testing.

### Rate Limiting

Discord API rate limits may cause temporary failures. The bot includes automatic retry logic, but some actions may be delayed.

### Supabase Free Tier

Free tier has limitations:
- 500MB database
- 50,000 monthly active users
- Realtime: 200 concurrent connections

Upgrade if you exceed these limits.

---

## Updates

Keep the bot updated for latest fixes:

```bash
git pull origin main
npm install
npm run register
# Restart bot
```

Check the changelog for breaking changes.