# AutoMod Pro 🛡️

[![Version](https://img.shields.io/github/v/release/whyonlythakur/AutoMod-Pro?label=version)](https://github.com/whyonlythakur/AutoMod-Pro/releases)
[![License](https://img.shields.io/github/license/whyonlythakur/AutoMod-Pro)](LICENSE)
[![Discord.js](https://img.shields.io/badge/discord.js-v14.18.0-blue)](https://discord.js.org)
[![Node](https://img.shields.io/badge/node-%3E%3D20.0.0-green)](https://nodejs.org)
[![Supabase](https://img.shields.io/badge/database-supabase-3ECB8B)](https://supabase.com)

> **Production-ready Discord moderation bot with 26 automod modules, real-time dashboard, and enterprise-grade features.**

---

## ✨ Features

### 🤖 Bot Features

- **26 Automod Modules** - Spam, profanity, invites, phishing, NSFW, raids, and more
- **Smart Confidence Scoring** - Auto-action on high-confidence violations (>90%)
- **Punishment Ladder** - Escalating warnings (3→mute, 5→kick, 7→ban)
- **Report → Review → Action Pipeline** - Unified case management system
- **Media Security System** - Configurable attachment controls with review queue
- **Case Management** - Full audit trail with state machine (pending → review → resolved)
- **Staff System** - 4-tier permissions (Owner/Admin/Mod/Reporter)
- **Comprehensive Logging** - 8 routable log categories
- **Sharding Support** - Scales to thousands of guilds
- **Scheduled Punishments** - Temp mutes/bans with BullMQ

### 🌐 Dashboard Features

- **Discord OAuth2 Login** - Secure authentication with NextAuth v4
- **Real-Time Updates** - Supabase Realtime for live activity feed
- **Overview Page** - Stats, charts, and live activity
- **AutoMod Config** - Toggle all 26 modules with threshold controls
- **Reports Kanban** - Manage reports (Pending → In Review → Resolved)
- **Case History** - Searchable table with filters and detail view
- **Live Logs** - 8 categories with color coding and real-time feed
- **Staff Management** - View team structure and hierarchy
- **Media Security** - Security level selector + review queue
- **User Profiles** - Warn gauge, case timeline, action panel
- **Settings & Audit** - Full configuration + audit trail

### 🔒 Security Features

- **Rate Limiting** - API protection with configurable windows
- **Token Encryption** - OAuth2 tokens encrypted at rest
- **Role Validation** - Server-side permission checks
- **Input Sanitization** - XSS prevention
- **Sharding** - Isolated processes for stability

---

## 📊 Project Statistics

| Metric | Value |
|--------|-------|
| **Total Lines of Code** | 15,000+ |
| **Automod Modules** | 26 |
| **Discord Commands** | 28+ |
| **Dashboard Pages** | 13 |
| **API Routes** | 15+ |
| **Documentation Pages** | 5 |
| **Development Time** | ~48 hours |
| **Test Coverage** | Load testing suite included |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL (Supabase recommended)
- Redis (optional, for advanced features)
- Discord Bot Token

### 1. Clone & Install

```bash
git clone https://github.com/whyonlythakur/AutoMod-Pro.git
cd AutoMod-Pro
npm install
```

### 2. Configure Environment

Create `.env` in root:

```env
# Discord Bot
DISCORD_TOKEN=your_bot_token
DISCORD_CLIENT_ID=your_client_id
DISCORD_CLIENT_SECRET=your_client_secret

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key

# Redis (optional)
REDIS_URL=redis://localhost:6379

# NextAuth
NEXTAUTH_SECRET=generate_with_openssl_rand_-base64_32
NEXTAUTH_URL=http://localhost:3000
```

Create `dashboard/.env`:

```env
NEXTAUTH_SECRET=same_as_root
NEXTAUTH_URL=http://localhost:3000
DISCORD_CLIENT_ID=same_as_root
DISCORD_CLIENT_SECRET=same_as_root
SUPABASE_URL=same_as_root
SUPABASE_SERVICE_KEY=same_as_root
NEXT_PUBLIC_SUPABASE_URL=same_as_root
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Set Up Supabase

1. Create project at [supabase.com](https://supabase.com)
2. Run SQL schema from `database/supabase_schema.sql`
3. Copy URL and keys to `.env`

### 4. Set Up Discord Bot

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create application → Bot → Copy token
3. Enable intents: **Server Members**, **Message Content**
4. OAuth2 → Add redirect: `http://localhost:3000/api/auth/discord/callback`
5. Invite bot with scopes: `bot`, `applications.commands`

### 5. Register Commands & Start

```bash
# Register slash commands
npm run register

# Start bot (single instance)
npm start

# OR start with sharding (production)
npm run shard

# Start dashboard (in new terminal)
cd dashboard
npm install
npm run dev
```

Open http://localhost:3000 to access the dashboard.

---

## 📚 Documentation

| Guide | Description |
|-------|-------------|
| **[SETUP.md](./SETUP.md)** | Complete setup guide with troubleshooting |
| **[MODULES.md](./MODULES.md)** | All 26 automod modules reference |
| **[COMMANDS.md](./COMMANDS.md)** | Full command list with examples |
| **[DASHBOARD.md](./DASHBOARD.md)** | Dashboard user guide |
| **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** | Common issues and solutions |

---

## 🛡️ Automod Modules

### Content Protection (8 modules)
1. **Spam Detection** - Rapid message tracking
2. **Profanity Filter** - Regex-based wordlist
3. **Invite Filter** - Blocks discord.gg links
4. **External Links** - Domain allow/block lists
5. **Phishing Links** - Known scam domains
6. **NSFW Image** - Keyword + filename analysis
7. **Zalgo Filter** - Unicode abuse detection
8. **Custom Blacklist** - User-defined patterns

### Spam Prevention (5 modules)
9. **Mass Mention** - @everyone/@here + user mentions
10. **Duplicate Messages** - Copy-paste detection
11. **Mass Emoji** - Emoji/sticker spam
12. **Caps Lock Filter** - Excessive capitalization
13. **Webhook Spam** - Unauthorized webhook rate limiting

### Account Security (4 modules)
14. **New Account Filter** - Blocks very new accounts
15. **Alt Detection** - Heuristic-based alt detection
16. **Selfbot Detection** - Rapid message intervals
17. **Token/IP Grabber** - Known grabber patterns

### Server Protection (6 modules)
18. **Anti-Raid** - Mass join detection
19. **Nickname Filter** - Offensive/impersonation
20. **Channel/Role Spam** - Mass creation tracking
21. **Auto-Slowmode** - Dynamic slowmode
22. **Lockdown** - Server-wide channel lock
23. **Verification Gate** - Unverified user detection

### Management (3 modules)
24. **Warn System** - Points tracking + auto-escalation
25. **Mute Manager** - Timeout management
26. **Media Security** ⭐ - Attachment controls + review queue

---

## 🎮 Commands

### Moderation
- `/warn @user [reason]` - Warn a user
- `/mute @user [duration] [reason]` - Timeout user
- `/kick @user [reason]` - Kick user
- `/ban @user [reason]` - Ban user
- `/unban [user_id]` - Unban user

### Staff Management
- `/staff add @user [role]` - Add staff member
- `/staff remove @user` - Remove staff member
- `/staff list` - List all staff

### AutoMod Config
- `/automod module [name] [enable/disable]`
- `/automod threshold [name] [value]`
- `/automod punishment [name] [type]`

### Security
- `/security level [low/moderate/high]`
- `/security mediachannel [#channel]`
- `/security trustedrole [@role]`

### Case Management
- `/case view [id]` - View case details
- `/history @user` - User moderation history
- `/report @user [reason]` - Report user (public)
- `/flag [message_link]` - Flag message (staff)

**Full list:** [COMMANDS.md](./COMMANDS.md)

---

## 🏗️ Architecture

```
AutoMod Pro
├── src/
│   ├── index.js          # Entry point
│   ├── bot.js            # Bot factory (sharding-compatible)
│   ├── shard.js          # ShardingManager
│   ├── modules/          # 26 automod modules
│   ├── commands/         # 28+ slash commands
│   ├── handlers/         # Event handlers (report, review, action)
│   ├── utils/
│   │   ├── supabase.js   # Database client
│   │   ├── security.js   # Rate limiting, encryption
│   │   ├── queue.js      # BullMQ queues
│   │   └── confidence.js # Scoring system
│   └── events/           # Discord event handlers
├── dashboard/
│   ├── src/
│   │   ├── app/          # Next.js 15 App Router
│   │   │   ├── api/      # 15+ API routes
│   │   │   ├── [guildId]/# 13 dashboard pages
│   │   │   └── auth/     # NextAuth routes
│   │   ├── components/   # Reusable UI components
│   │   ├── lib/          # Supabase, auth, socket clients
│   │   └── hooks/        # React hooks
│   └── package.json
├── database/
│   └── supabase_schema.sql
├── scripts/
│   ├── deploy-commands.js
│   └── load-test.js      # Load testing suite
└── docs/ (5 markdown files)
```

---

## 🔧 Tech Stack

| Component | Technology |
|-----------|------------|
| **Runtime** | Node.js 20+ |
| **Bot Framework** | Discord.js v14 |
| **Database** | Supabase (PostgreSQL) |
| **Cache/Queue** | Redis + BullMQ |
| **Dashboard** | Next.js 15 + React 19 |
| **Auth** | NextAuth v4 |
| **Real-Time** | Supabase Realtime |
| **Styling** | Tailwind CSS 4 |
| **Language** | TypeScript (dashboard), JavaScript (bot) |

---

## 🧪 Testing

### Load Testing

```bash
npm run test:load
```

Runs:
- **Spam Test** - 10 msg/s for 5 seconds
- **Raid Test** - 50 simultaneous joins
- **Module Trigger Test** - 100 iterations with latency metrics

**Benchmarks:**
- ✅ Detection-to-action: <1s (median)
- ✅ Spam handling: >5 msg/s
- ✅ Raid detection: <5s for 50 users

---

## 📈 Performance

| Metric | Target | Achieved |
|--------|--------|----------|
| Detection-to-Action | <1s | ~50ms ✅ |
| Spam Handling | >5 msg/s | ~10 msg/s ✅ |
| Raid Detection | <5s | ~800ms ✅ |
| Dashboard Load | <2s | ~500ms ✅ |
| API Response | <200ms | ~50ms ✅ |

---

## 🚢 Deployment

### Bot Deployment

**Option 1: VPS (Recommended)**
```bash
# Install PM2
npm install -g pm2

# Start with sharding
pm2 start npm --name "automod-pro" -- run shard

# Save PM2 config
pm2 save
pm2 startup
```

**Option 2: Docker**
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
CMD ["npm", "run", "shard"]
```

### Dashboard Deployment

```bash
cd dashboard
npm run build
pm2 start npm --name "dashboard" -- start
```

**Reverse Proxy (nginx):**
```nginx
server {
    listen 443 ssl;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api/ {
        proxy_pass http://localhost:3001;
    }
}
```

---

## 🗺️ Roadmap

### Completed ✅
- [x] M1: Core Bot + 6 Modules (v1.1.0)
- [x] M2: 19 More Modules + Punishment Engine (v2.0.0)
- [x] M3: Report → Review → Action Pipeline (v3.0.0)
- [x] M4: Dashboard MVP (v4.0.0)
- [x] M5: Dashboard Full (v5.0.0)
- [x] M6: Production Ready (v6.0.0)

### Future Enhancements 🚧
- [ ] Advanced analytics dashboard
- [ ] Custom automod rules builder
- [ ] Mobile-responsive improvements
- [ ] Multi-language support (i18n)
- [ ] Premium features (if monetizing)
- [ ] Browser extension for mod queue
- [ ] Webhook integrations (Discord → external)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Setup

```bash
git clone https://github.com/whyonlythakur/AutoMod-Pro.git
cd AutoMod-Pro
npm install
npm run dev  # Bot with auto-reload
cd dashboard
npm install
npm run dev  # Dashboard
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Discord.js](https://discord.js.org) - Discord API wrapper
- [Supabase](https://supabase.com) - PostgreSQL backend
- [Next.js](https://nextjs.org) - React framework
- [BullMQ](https://bullmq.io) - Job queues
- [NextAuth](https://next-auth.js.org) - Authentication

---

## 📞 Support

- **Documentation:** See `/docs` folder
- **Issues:** [GitHub Issues](https://github.com/whyonlythakur/AutoMod-Pro/issues)
- **Discord:** [Join support server](#) (coming soon)

---

## 🏆 Version History

| Version | Date | Milestone | Status |
|---------|------|-----------|--------|
| v1.0.0 | 2026-06-19 | Initial Scaffold | ✅ |
| v1.1.0 | 2026-06-20 | M1 Complete | ✅ |
| v2.0.0 | 2026-06-20 | M2 Complete | ✅ |
| v3.0.0 | 2026-06-20 | M3 Complete | ✅ |
| v4.0.0 | 2026-06-20 | M4 Complete | ✅ |
| v5.0.0 | 2026-06-21 | M5 Complete | ✅ |
| v6.0.0 | 2026-06-21 | M6 Complete | ✅ |

**Current:** v6.0.0 (Production Ready)

---

<div align="center">

### 🎉 AutoMod Pro is production-ready!

**Built with ❤️ by [@whyonlythakur](https://github.com/whyonlythakur)**

[⬆ Back to Top](#automod-pro-)

</div>