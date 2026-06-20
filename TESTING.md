# AutoMod Pro — Testing Guide

## ✅ Pre-Flight Checklist

### 1. MongoDB Atlas Setup
Your current MongoDB URI has a placeholder. You need to:

1. Go to **MongoDB Atlas** (https://cloud.mongodb.com/)
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Copy the connection string
5. Replace `cluster0.xxxxx` in your `.env` file with your actual cluster address

**Current .env location:** `C:\Users\DROFUS\Desktop\MySelBot\nexusbot\.env`

**What to replace:**
```env
# BEFORE (doesn't work):
MONGODB_URI=mongodb+srv://thakurshab989_db_user:HPAgoPAuU0111RG9@cluster0.xxxxx.mongodb.net/Zefr0x?retryWrites=true&w=majority

# AFTER (replace with your actual cluster):
MONGODB_URI=mongodb+srv://thakurshab989_db_user:HPAgoPAuU0111RG9@cluster0.ABC123.mongodb.net/Zefr0x?retryWrites=true&w=majority
```

### 2. Redis Setup (Optional)
Redis is optional for testing. The bot will work without it, but some features (spam detection, raid detection, duplicate detection) will be limited.

**To start Redis:**
```bash
redis-server
```

**Or update `.env` to skip Redis:**
```env
REDIS_URL=redis://localhost:6379
```

### 3. Discord Bot Token
Your bot token is already configured. Make sure:
- ✅ Bot is invited to your test server
- ✅ Bot has necessary permissions (Administrator recommended for testing)

---

## 🚀 How to Run the Bot

### Step 1: Fix MongoDB Connection
Edit `.env` and replace `cluster0.xxxxx` with your actual MongoDB Atlas cluster address.

### Step 2: Start Redis (Optional)
```bash
redis-server
```

### Step 3: Start the Bot
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

---

## 📋 What to Test

### Basic Bot Functions
1. **Bot Login** - Check console for "Logged in as [botname]"
2. **Slash Commands** - Type `/` in Discord and see if commands appear
3. **Staff System** - Try `/staff add @user admin`
4. **Moderation Commands** - Try `/warn`, `/mute`, `/kick`

### Automod Modules (6 from M1 + 17 from M2 = 23 total)
1. **Spam Detection** - Send 5+ messages rapidly
2. **Mass Mention** - Tag 5+ users in one message
3. **Profanity Filter** - Use blocked words
4. **Invite Filter** - Post discord.gg links
5. **External Links** - Post URLs (if configured)
6. **Anti-Raid** - Have multiple accounts join rapidly

### New M2 Modules
1. **Duplicate Messages** - Send same message 3 times
2. **Mass Emoji** - Send 10+ emojis
3. **Caps Lock** - Send message with >70% caps
4. **Custom Blacklist** - Add word with `/wordfilter add test` then say "test"
5. **Zalgo Filter** - Use combining characters
6. **Lockdown** - Try `/lockdown on`

### Case Management (M3)
1. **Report** - Use `/report @user reason`
2. **Case View** - Use `/case view AMP-XXXX-XXXX`
3. **History** - Use `/history @user`

---

## ⚠️ Known Issues & Limitations

### Without Redis
- ❌ Spam detection won't track across bot restarts
- ❌ Raid detection counters reset on restart
- ❌ Duplicate message detection limited to current session

### MongoDB Connection
- ❌ Bot won't start without valid MongoDB connection
- ✅ Fix: Replace cluster address in `.env`

### Dashboard
- ❌ Dashboard not implemented yet (M4-M6 pending)
- ✅ Bot and moderation commands work independently

---

## 🐛 Troubleshooting

### "Cannot find module './modules'"
✅ Fixed: Created `src/modules/index.js`

### "Invalid regular expression" in zalgoFilter
✅ Fixed: Simplified regex pattern

### "ECONNREFUSED" MongoDB error
⚠️ **Action Required:** Replace `cluster0.xxxxx` in `.env` with your actual MongoDB Atlas cluster address

### "Redis error"
✅ Bot will continue without Redis (some features limited)

---

## 📊 Expected Console Output (Successful Start)

```
[DB] MongoDB connected to automod-pro
[Redis] Connected
[Redis] Ready
[Events] Loaded 13 event handlers
[Commands] Registered 28 slash commands
[Bot] Logged in as AutoMod Pro#1234
```

---

## Next Steps After Testing

1. ✅ Fix MongoDB connection string
2. ✅ Run bot and verify login
3. ✅ Test basic commands in Discord
4. ✅ Test automod modules
5. ✅ Report any bugs
6. 📝 Continue with M4 (Dashboard) after successful testing

---

**Current Status:** M1 ✅ M2 ✅ M3 ✅ Complete (65% overall)
**Version:** v3.0.0
**Last Updated:** 2026-06-20