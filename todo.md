# AutoMod Pro — Task List

## M1 — Core Bot + Priority Modules (6 modules)

### Phase 0 — Environment
- [ ] [P0] Install Git, GitHub CLI, configure git user
- [ ] [P0] GitHub CLI auth login (manual step)

### Phase 1 — Scaffold & Core
- [ ] [P0] Create project scaffold (package.json, .env.example, .gitignore)
- [ ] [P0] Bot entrypoint: index.js + bot.js + config.js (login, DB connect, event wire)
- [ ] [P0] Mongoose connection setup + Guild/Case/User/MediaCase schemas
- [ ] [P0] Redis client singleton
- [ ] [P0] Permission middleware (Owner/Server Owner/Admin/Mod/Reporter tiers)
- [ ] [P0] Command registrar (slash + prefix dual handler)
- [ ] [P0] Deploy-commands script

### Phase 1 — Staff System
- [ ] [P0] Staff system: /staff add, /staff remove, DB persistence

### Phase 1 — Priority Modules
- [ ] [P0] Module: Spam Detection (message-frequency, Redis counters)
- [ ] [P0] Module: Mass Mention Filter (@everyone/@here/mass pings)
- [ ] [P0] Module: Bad Word / Profanity Filter (wordlist + regex)
- [ ] [P0] Module: Invite Link Filter (block/whitelist)
- [ ] [P0] Module: External Link Filter (domain allow/block)
- [ ] [P0] Module: Anti-Raid (mass join detection, auto-lockdown trigger)

### Phase 1 — Logging & Commands
- [ ] [P0] Log handler + 8 routable log channels
- [ ] [P1] Message handler: wire messageCreate → module checks → case pipeline
- [ ] [P1] Member handler: wire guildMemberAdd → raid/alt/new-account checks
- [ ] [P1] Mod commands: /warn, /mute, /kick, /ban, /unban, /unmute
- [ ] [P1] /report command (user-facing report creation)
- [ ] [P1] /flag command (staff manual flag → case)
- [ ] [P1] Embed builder utility (color-coded rich embeds)
- [ ] [P2] /prefix set command
- [ ] [P2] /config export/import command
- [ ] [P2] /dashboard link command
- [ ] [P2] Error handling & graceful shutdown

## M2 — Remaining 19 Modules + Punishment Ladder Engine

- [ ] [P0] Punishment ladder engine (warn→mute→kick→ban per module, point thresholds)
- [ ] [P0] Module: Duplicate/Copy-paste Detection
- [ ] [P0] Module: Mass Emoji / Sticker Spam
- [ ] [P0] Module: Caps Lock Filter
- [ ] [P1] Module: Custom Word/Phrase Blacklist
- [ ] [P1] Module: Phishing/Scam Link Detection
- [ ] [P1] Module: NSFW Image Detection
- [ ] [P1] Module: Zalgo / Unicode Abuse
- [ ] [P1] Module: New Account Filter
- [ ] [P1] Module: Alt Account Detection
- [ ] [P1] Module: Webhook/Bot Spam Protection
- [ ] [P1] Module: Nickname Filter
- [ ] [P1] Module: Channel/Role Spam Protection
- [ ] [P1] Module: Auto-Slowmode
- [ ] [P1] Module: Token/IP Grabber Link Detection
- [ ] [P1] Module: Selfbot Detection
- [ ] [P1] Module: Warn System (point-based auto-escalation)
- [ ] [P1] Module: Mute/Timeout Manager
- [ ] [P1] Module: Lockdown Mode
- [ ] [P1] Module: Verification Gate
- [ ] [P1] Module: Media Security System (full workflow)
- [ ] [P1] /wordfilter add/remove commands
- [ ] [P1] /linkfilter allow/block commands
- [ ] [P1] Security commands: /security level, mediachannel, reviewchannel, trustedrole, autoescalate, status
- [ ] [P2] /automod module enable/disable command
- [ ] [P2] /automod threshold command
- [ ] [P2] /automod punishment command
- [ ] [P2] /raidmode on/off/auto command

## M3 — Report → Review → Action Pipeline (Discord-side)

- [ ] [P0] Case creation pipeline (auto-detect + manual report → unified Case)
- [ ] [P0] Confidence scoring + auto-resolve logic (>90% + low-severity)
- [ ] [P0] Review queue embeds with button interactions
- [ ] [P0] Action handler: execute punishment, DM offender, log audit
- [ ] [P1] Media review workflow (intercept → review → approve/reject → webhook relay)
- [ ] [P1] /case view command
- [ ] [P1] /history command
- [ ] [P1] /lockdown command
- [ ] [P2] Appeal link generation (configurable)
- [ ] [P2] Case states: pending → in_review → resolved | dismissed | escalated

## M4 — Dashboard MVP

- [ ] [P0] Discord OAuth2 login flow
- [ ] [P0] Server switcher + guild selection
- [ ] [P0] Overview page: stat cards, charts, activity feed
- [ ] [P0] Automod config page: module toggle grid + threshold sliders
- [ ] [P0] Reports kanban page: Pending | In Review | Resolved columns
- [ ] [P1] WebSocket integration (Socket.IO) for live stats + report queue
- [ ] [P1] Sidebar + topbar layout
- [ ] [P2] Component library build-out: StatCard, ModuleToggleCard, KanbanColumn, ReportDrawer, etc.

## M5 — Dashboard Full

- [ ] [P0] Cases page: searchable history table + detail view
- [ ] [P0] Logs page: channel router + live tail feed
- [ ] [P0] Staff page: role management + hierarchy diagram
- [ ] [P0] Media Security page: level selector, channel bindings, review queue
- [ ] [P1] User profile page: warn gauge, timeline, action panel
- [ ] [P1] Settings page: prefix, verification, danger zone
- [ ] [P1] Audit trail page
- [ ] [P2] Dashboard ↔ command config sync (every setting readable/writable both ways)
- [ ] [P2] PDF export for case details

## M6 — Load Testing, Sharding, Security, Launch

- [ ] [P0] Discord.js ShardingManager setup
- [ ] [P0] Security review: OAuth2 token encryption, server-side role enforcement, API rate limiting
- [ ] [P1] Load testing: spam simulation, raid simulation, concurrent dashboard users
- [ ] [P1] Redis counter persistence across bot restarts
- [ ] [P1] BullMQ integration for punishment scheduling (auto-unmute, temp-ban expiry)
- [ ] [P2] <1s median detection-to-action benchmark
- [ ] [P2] 100% report routing verification (zero silent drops)
- [ ] [P2] Documentation: setup guide, module reference, dashboard guide
- [ ] [P2] Launch checklist
