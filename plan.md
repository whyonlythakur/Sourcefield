# AutoMod Pro — Master Implementation Plan

> **Document Purpose:** Complete roadmap from M1 to M6 with all sub-categories, current progress tracking, and remaining work.  
> **Last Updated:** 2026-06-20  
> **Current Version:** v1.1.0 (M1 Complete)  
> **Overall Progress:** 19% (15/78 tasks)

---

## Executive Summary

AutoMod Pro is a **fully-automatic Discord moderation bot** with 26 automod modules, a Report → Review → Action pipeline, and a full-featured web dashboard. The project is divided into 6 milestones (M1-M6), each building on the previous.

**Current Status:** M1 (Core Bot + 6 Priority Modules) is **100% complete**. Ready to begin M2.

---

## M1 — Core Bot + Priority Modules (6 modules) ✅ **COMPLETE**

**Status:** 100% ✅  
**Completion Date:** 2026-06-20  
**Version:** v1.1.0

### 1.1 Environment Setup ✅
- [x] Install Git, GitHub CLI
- [x] Configure git user (whyonlythakur)
- [x] GitHub CLI authentication
- [x] Create private GitHub repo (whyonlythakur/AutoMod-Pro)

### 1.2 Project Scaffold ✅
- [x] package.json (discord.js v14, mongoose, ioredis, etc.)
- [x] .env.example (MongoDB Atlas + Redis Cloud instructions)
- [x] .gitignore
- [x] Directory structure (src/, dashboard/, scripts/)

### 1.3 Bot Core ✅
- [x] src/index.js (entrypoint with config validation, graceful shutdown)
- [x] src/bot.js (Discord client factory with intents)
- [x] src/config.js (env-based config with required var checks)
- [x] MongoDB Atlas connection
- [x] Redis Cloud connection
- [x] client.db namespace (Guild, Case, User, MediaCase models)

### 1.4 Permission System ✅
- [x] 4-tier permission model (Owner/ServerOwner/Admin/Moderator/Reporter)
- [x] src/middleware/permissions.js (getTier, hasPermission)
- [x] Integration with all moderation commands

### 1.5 Staff System ✅
- [x] /staff add command (with permission checks, DB persistence)
- [x] /staff remove command
- [x] Guild.staff[] schema with role types

### 1.6 Priority Modules (6/26) ✅
1. [x] **Spam Detection** — Redis-based frequency tracking (5s window, 5 msg threshold)
2. [x] **Mass Mention Filter** — @everyone/@here + user mentions (>5 mentions)
3. [x] **Profanity Filter** — Regex wordlist (EN), severe pattern detection
4. [x] **Invite Link Filter** — discord.gg detection, whitelist support
5. [x] **External Link Filter** — URL regex, domain allow/block lists
6. [x] **Anti-Raid** — Join rate tracking in Redis (60s window, 5 joins threshold)

### 1.7 Logging System ✅
- [x] 8 log channel categories (modActions, automodTriggers, messageLogs, memberLogs, raidLogs, caseLogs, serverLogs, errorLogs)
- [x] src/handlers/logHandler.js (sendLog function)
- [x] src/utils/embeds.js (buildLogEmbed, buildCaseEmbed, buildModActionEmbed)
- [x] Color-coded embeds per category

### 1.8 Moderation Commands ✅
- [x] /warn (User.warnPoints tracking, case creation, DM notification)
- [x] /mute (duration parsing: 10m/1h/1d, Discord timeout, logging)
- [x] /unmute (timeout removal, logging)
- [x] /kick (case creation, logging, DM)
- [x] /ban (permanent + temporary, deleteMessageSeconds, logging)
- [x] /unban (by user ID, case logging)

### 1.9 Case Management ✅
- [x] src/handlers/messageHandler.js (modules → auto case creation)
- [x] src/handlers/memberHandler.js (raid detection, new account checks, auto-kick)
- [x] /report command (user-facing, staff ping, case logging)
- [x] /flag command (staff-only, message link parsing)

### 1.10 Event Handlers ✅
- [x] guildCreate (auto-create Guild doc)
- [x] guildDelete (cleanup Guild doc)
- [x] guildMemberAdd (Redis join tracking, raid detection)
- [x] All 11 base event listeners wired

### 1.11 Utilities ✅
- [x] src/utils/caseId.js (AMP-TIMESTAMP-COUNTER format)
- [x] src/utils/confidence.js (calculateConfidence, shouldAutoResolve)
- [x] src/utils/embeds.js (3 embed builders)
- [x] Duration parser (for mute/ban commands)

### 1.12 Infrastructure ✅
- [x] Git repo initialized
- [x] Initial commit v1.0.0 (2026-06-19)
- [x] Updated commit v1.1.0 (2026-06-20)
- [x] Tracking files (todo.md, completed.md, progress.md, git.md, plan.md)

**M1 Deliverables:**
- ✅ Working bot login + MongoDB + Redis
- ✅ 6 automod modules detecting violations
- ✅ 8 log channel categories
- ✅ 6 moderation commands with full logging
- ✅ Staff system with 4 permission tiers
- ✅ Automatic case generation from modules + manual reports
- ✅ User warn points tracking

---

## M2 — Remaining 19 Modules + Punishment Ladder Engine ⏳ **NEXT**

**Status:** 0% ⏳  
**Estimated Effort:** 12-15 hours  
**Priority:** P0-P2

### 2.1 Punishment Ladder Engine 🔴 **P0**
- [ ] src/handlers/actionHandler.js (executePunishment function)
- [ ] Point-based escalation (3 warns = mute, 5 warns = kick, 7 warns = ban)
- [ ] Per-module ladder configuration in Guild.modules
- [ ] Auto-escalation on threshold breach
- [ ] Integration with all automod modules

### 2.2 Content Filter Modules 🔴 **P0-P1**
- [ ] **Duplicate/Copy-paste Detection** — Same content across channels (3 strikes)
- [ ] **Mass Emoji / Sticker Spam** — >10 emojis/stickers in message
- [ ] **Caps Lock Filter** — >70% uppercase characters
- [ ] **Custom Word/Phrase Blacklist** — Server-specific regex patterns
- [ ] **Zalgo / Unicode Abuse** — Detect excessive combining characters

### 2.3 Security Modules 🔴 **P1**
- [ ] **Phishing/Scam Link Detection** — Free API integration (scam-link DBs)
- [ ] **NSFW Image Detection** — Hive Moderation free tier API
- [ ] **Token/IP Grabber Link Detection** — Known grabber URL patterns
- [ ] **Selfbot Detection** — Heuristics (rapid messages, user bot=false)

### 2.4 Account Protection Modules 🔴 **P1**
- [ ] **New Account Filter** — Enhanced from M1 (kick/flag options)
- [ ] **Alt Account Detection** — Avatar hash, join patterns, username similarity
- [ ] **Webhook/Bot Spam Protection** — Unauthorized webhook creation alerts

### 2.5 Server Protection Modules 🔴 **P1**
- [ ] **Nickname Filter** — Offensive/impersonation detection
- [ ] **Channel/Role Spam Protection** — Mass creation rate limiting
- [ ] **Auto-Slowmode** — Dynamic slowmode on message velocity spikes
- [ ] **Lockdown Mode** — Server-wide channel lock command

### 2.6 User Management Modules 🔴 **P1**
- [ ] **Warn System** — Point-based auto-escalation (integrates with 2.1)
- [ ] **Mute/Timeout Manager** — Enhanced from M1 (queue for temp mutes)
- [ ] **Verification Gate** — Captcha/reaction-role join gate

### 2.7 Media Security System (Module 26) 🔴 **P1 — FLAGSHIP**
- [ ] src/modules/mediaSecurity.js (security levels: Low/Moderate/High)
- [ ] Media channel designation (single approved channel)
- [ ] Review channel with slowmode + staff-only visibility
- [ ] Trusted Media Uploader role (exempt from all restrictions)
- [ ] Media review workflow:
  - Intercept media in High security
  - Post to #media-review with ✅/❌ reactions
  - On approve: relay via webhook to Media Channel (original author name/avatar)
  - On reject: DM user with custom reason
- [ ] Auto-escalate to High during active raids

### 2.8 Configuration Commands 🔴 **P2**
- [ ] /automod module enable/disable [name]
- [ ] /automod threshold [name] [value]
- [ ] /automod punishment [name] [ladder]
- [ ] /wordfilter add/remove [pattern]
- [ ] /linkfilter allow/block [domain]
- [ ] /raidmode on/off/auto

### 2.9 Security Commands 🔴 **P2**
- [ ] /security level [low/moderate/high]
- [ ] /security mediachannel [#channel]
- [ ] /security reviewchannel [#channel]
- [ ] /security trustedrole [@role]
- [ ] /security autoescalate [on/off]
- [ ] /security status

**M2 Deliverables:**
- All 26 modules functional
- Punishment ladder engine with auto-escalation
- Media Security System (full §5A workflow)
- Full config command set
- Security command set

---

## M3 — Report → Review → Action Pipeline ⏳

**Status:** 0% ⏳  
**Estimated Effort:** 6-8 hours  
**Dependencies:** M2.1 (Punishment ladder)

### 3.1 Case Creation Pipeline 🔴 **P0**
- [ ] Unified case creation (auto-detect + manual report)
- [ ] Evidence snapshot (content, attachments, confidence score)
- [ ] Case ID generation (AMP-TIMESTAMP-COUNTER)
- [ ] Status tracking (pending → in_review → resolved|dismissed|escalated)

### 3.2 Confidence Scoring 🔴 **P0**
- [ ] src/utils/confidence.js (enhanced)
- [ ] Auto-resolve logic (>90% confidence + low-severity = instant action)
- [ ] Medium/low confidence → manual review queue

### 3.3 Review Queue (Discord-side) 🔴 **P0**
- [ ] src/handlers/reviewHandler.js
- [ ] Embed with evidence, offender history, suggested punishment
- [ ] Button interactions: ✅ Approve / ❌ Dismiss / ⚠️ Escalate
- [ ] First reaction wins (prevent double-action)
- [ ] Log review decisions to caseLogs

### 3.4 Action Handler 🔴 **P0**
- [ ] src/handlers/actionHandler.js (enhanced)
- [ ] Execute punishment (warn/mute/kick/ban per ladder)
- [ ] DM offender with reason + appeal link
- [ ] Log to appropriate channel
- [ ] Update case status to resolved

### 3.5 Media Review Workflow 🔴 **P1**
- [ ] src/handlers/mediaReviewHandler.js (full §5A.3 implementation)
- [ ] Intercept → delete → repost to #media-review
- [ ] Reaction-based approval (✅ → webhook relay, ❌ → custom reason DM)
- [ ] Webhook name/avatar set to original uploader
- [ ] Case logging for all media reviews

### 3.6 Case Commands 🔴 **P1**
- [ ] /case view [id] (case detail embed)
- [ ] /history @user (punishment timeline)
- [ ] /lockdown [on/off] (server-wide channel lock)

### 3.7 Case States 🔴 **P2**
- [ ] State machine: pending → in_review → resolved | dismissed | escalated
- [ ] State persistence in MongoDB
- [ ] State transition logging

**M3 Deliverables:**
- Unified case pipeline (auto + manual)
- Review queue with button interactions
- Auto-action for high-confidence cases
- Media review workflow (Discord-side)
- Full audit trail

---

## M4 — Dashboard MVP ⏳

**Status:** 0% ⏳  
**Estimated Effort:** 15-20 hours  
**Dependencies:** M3 (case pipeline for Reports page data)

### 4.1 Backend API Setup 🔴 **P0**
- [ ] dashboard/src/app/api/ routes (Next.js API routes or Express)
- [ ] Discord OAuth2 (NextAuth with Discord provider)
- [ ] Session management
- [ ] Guild data endpoints (GET /api/guilds/:id, PATCH /api/guilds/:id/modules)

### 4.2 Authentication 🔴 **P0**
- [ ] /login page (Discord OAuth2 flow)
- [ ] Callback handler
- [ ] Server selection page (grid of guilds bot is in)

### 4.3 Overview Page 🔴 **P0**
- [ ] dashboard/src/app/[guildId]/overview/page.tsx
- [ ] 4 stat cards (Total Members, Active Cases, Auto-Actions 24h, Raid Status)
- [ ] Line chart (actions over 7/30 days)
- [ ] Donut chart (case breakdown by module)
- [ ] Recent Activity feed (last 10 events)

### 4.4 Automod Config Page 🔴 **P0**
- [ ] dashboard/src/app/[guildId]/automod/page.tsx
- [ ] Module toggle grid (26 cards with ON/OFF switches)
- [ ] Threshold sliders/steppers per module
- [ ] Punishment ladder mini-editor (drag-reorder)
- [ ] Sticky "Save Changes" bar with diff preview

### 4.5 Reports Kanban 🔴 **P0**
- [ ] dashboard/src/app/[guildId]/reports/page.tsx
- [ ] 3 columns: Pending | In Review | Resolved
- [ ] Case cards (offender avatar, module icon, confidence badge, time-ago)
- [ ] Side-drawer on click (evidence, history, action buttons)
- [ ] Approve / Escalate / Dismiss / Edit Punishment buttons

### 4.6 WebSocket Integration 🔴 **P1**
- [ ] Socket.IO server (Node.js + Express or Next.js API route)
- [ ] Client: dashboard/src/lib/socket.ts
- [ ] Live stats updates
- [ ] Live report queue updates (kanban card moves in real-time)
- [ ] Prevent double-action (dashboard + Discord race condition)

### 4.7 Layout Components 🔴 **P1**
- [ ] Top bar (server switcher, status pill, notifications, profile menu)
- [ ] Left sidebar (icon nav: Overview, AutoMod, Reports, Cases, Logs, Staff, Media Security, Settings, Audit)
- [ ] Responsive design (mobile-friendly down to 375px)

### 4.8 Component Library 🔴 **P2**
- [ ] StatCard, ModuleToggleCard, KanbanColumn, ReportDrawer
- [ ] ConfidenceBadge, SeverityPill, PunishmentLadderEditor
- [ ] LiveLogFeed, DangerZoneCard, RoleBadge, EmptyState

**M4 Deliverables:**
- Working dashboard with OAuth2 login
- Overview + AutoMod Config + Reports pages
- Live WebSocket updates
- Component library foundation

---

## M5 — Dashboard Full ⏳

**Status:** 0% ⏳  
**Estimated Effort:** 12-15 hours  
**Dependencies:** M4 (API + WebSocket foundation)

### 5.1 Cases Page 🔴 **P0**
- [ ] dashboard/src/app/[guildId]/cases/page.tsx
- [ ] Searchable data table (Case ID, User, Module, Status, Punishment, Date)
- [ ] Row click → read-only case detail page
- [ ] PDF export for appeals

### 5.2 Logs Page 🔴 **P0**
- [ ] dashboard/src/app/[guildId]/logs/page.tsx
- [ ] Left: 8 log category selectors with channel picker dropdowns
- [ ] Right: Live tail feed (embed-styled preview matching Discord)
- [ ] WebSocket-powered real-time updates

### 5.3 Staff Page 🔴 **P0**
- [ ] dashboard/src/app/[guildId]/staff/page.tsx
- [ ] Table of current Bot Admins/Moderators
- [ ] "Add Staff" modal (user search + role select)
- [ ] Visual role hierarchy diagram (Owner → Admin → Mod → Reporter)
- [ ] Permission matrix checklist

### 5.4 Media Security Page 🔴 **P0**
- [ ] dashboard/src/app/[guildId]/media-security/page.tsx
- [ ] Security level selector (3-position segmented control: Low/Moderate/High)
- [ ] Channel bindings card (Media Channel + Review Channel dropdowns)
- [ ] Trusted Role picker + member count badge
- [ ] Live Review Queue panel (kanban, synced with Discord via WebSocket)
- [ ] Recent Activity table (approved/rejected media history)

### 5.5 User Profile Page 🔴 **P1**
- [ ] dashboard/src/app/[guildId]/users/[id]/page.tsx
- [ ] Header: avatar, username, join date, account age
- [ ] Warn-point gauge (circular progress, color shifts green→amber→red)
- [ ] Timeline of every case (oldest to newest)
- [ ] Manual action panel: Warn / Mute / Kick / Ban buttons

### 5.6 Settings Page 🔴 **P1**
- [ ] dashboard/src/app/[guildId]/settings/page.tsx
- [ ] General section (prefix, language)
- [ ] Verification Gate builder (captcha type, gate role, welcome message preview)
- [ ] Danger Zone (red-bordered: Reset Config, Transfer Ownership, Remove Bot — requires typing server name to confirm)

### 5.7 Audit Trail Page 🔴 **P1**
- [ ] dashboard/src/app/[guildId]/audit/page.tsx
- [ ] Full audit trail of dashboard + command changes
- [ ] Actor, before/after diff, timestamp
- [ ] Filterable by actor, action type, date range

### 5.8 Dashboard ↔ Command Sync 🔴 **P2**
- [ ] Every setting changeable via both surfaces
- [ ] Real-time sync (change in dashboard → updates in Discord, and vice versa)
- [ ] Conflict resolution (last-write-wins with audit log)

### 5.9 PDF Export 🔴 **P2**
- [ ] Case detail page → PDF export (for appeals)
- [ ] Includes: case info, evidence, punishment, timeline

**M5 Deliverables:**
- Full dashboard parity with commands
- Every setting changeable via dashboard
- Audit trail for all changes
- Media Security page with live review queue
- User profiles with action panel

---

## M6 — Load Testing, Sharding, Security, Launch ⏳

**Status:** 0% ⏳  
**Estimated Effort:** 8-10 hours

### 6.1 ShardingManager 🔴 **P0**
- [ ] src/shard.js (Discord.js ShardingManager)
- [ ] Shard count auto-detection
- [ ] Cross-shard communication for global stats
- [ ] Graceful shard restart on crash

### 6.2 Security Hardening 🔴 **P0**
- [ ] OAuth2 token encryption at rest (AES-256)
- [ ] Server-side role enforcement (all API endpoints check permissions)
- [ ] API rate limiting (per-user, per-IP)
- [ ] Input validation + sanitization
- [ ] SQL/NoSQL injection prevention

### 6.3 Load Testing 🔴 **P1**
- [ ] Spam simulation script (100 msgs/sec per user)
- [ ] Raid simulation (50 joins in 30s)
- [ ] Concurrent dashboard users (100+ simultaneous WebSocket connections)
- [ ] Performance profiling (memory, CPU, DB query times)

### 6.4 Redis Persistence 🔴 **P1**
- [ ] Redis AOF (Append-Only File) enabled
- [ ] Counter persistence across bot restarts
- [ ] Test: restart bot mid-raid → counters survive

### 6.5 BullMQ Integration 🔴 **P1**
- [ ] Punishment scheduling queue
- [ ] Auto-unmute jobs (scheduled execution)
- [ ] Temp-ban expiry jobs
- [ ] Job persistence (survives restarts)

### 6.6 Performance Benchmarks 🔴 **P2**
- [ ] <1s median detection-to-action time
- [ ] 100% report routing verification (zero silent drops)
- [ ] <100ms API response times (dashboard)
- [ ] <500ms WebSocket latency

### 6.7 Documentation 🔴 **P2**
- [ ] SETUP.md (installation, MongoDB Atlas, Redis Cloud, Discord OAuth2)
- [ ] MODULES.md (reference for all 26 modules)
- [ ] COMMANDS.md (slash + prefix command reference)
- [ ] DASHBOARD.md (dashboard user guide)
- [ ] TROUBLESHOOTING.md (common issues + fixes)

### 6.8 Launch Checklist 🔴 **P2**
- [ ] All M1-M5 tasks complete
- [ ] Security review passed
- [ ] Load testing passed (benchmarks met)
- [ ] Documentation complete
- [ ] GitHub repo public (or private with team access)
- [ ] Bot invite link generated
- [ ] Dashboard deployed (Vercel/Node host)
- [ ] Monitoring setup (Sentry, LogRocket, or similar)

**M6 Deliverables:**
- Production-ready bot
- Sharding for large guild counts
- Security hardened
- Load tested
- Full documentation
- Launch checklist complete

---

## Progress Summary

| Milestone | Tasks | Complete | Remaining | % Done | Status |
|-----------|-------|----------|-----------|--------|--------|
| **M1** | 15 | 15 | 0 | **100%** | ✅ Complete |
| **M2** | 28 | 0 | 28 | **0%** | ⏳ Next |
| **M3** | 10 | 0 | 10 | **0%** | ⏳ Pending |
| **M4** | 7 | 0 | 7 | **0%** | ⏳ Pending |
| **M5** | 9 | 0 | 9 | **0%** | ⏳ Pending |
| **M6** | 9 | 0 | 9 | **0%** | ⏳ Pending |
| **TOTAL** | **78** | **15** | **63** | **19%** | **In Progress** |

---

## Critical Path

```
M1 (Core + 6 modules) ✅
  ↓
M2 (19 modules + ladder engine) ⏳
  ↓
M3 (Report pipeline) ⏳
  ↓
M4 (Dashboard MVP) ⏳
  ↓
M5 (Dashboard Full) ⏳
  ↓
M6 (Sharding + Security + Launch) ⏳
```

**Key Dependencies:**
- M2.1 (Punishment ladder) required before M3 can execute auto-punishments
- M3 (case pipeline) required before M4 (Reports page needs case data)
- M4 (API + WebSocket) required before M5 (dashboard pages build on foundation)
- M2.20 (Media Security) is standalone but complex — may need dedicated focus

---

## Next Steps

**Immediate:** Begin M2 implementation
1. Start with M2.1 (Punishment ladder engine) — foundational for auto-escalation
2. Implement modules in priority order (duplicate, massEmoji, capsLock, customBlacklist, etc.)
3. Finish with M2.20 (Media Security System) — most complex, flagship feature

**After M2:** M3 (Report → Review → Action pipeline)
**After M3:** M4 (Dashboard MVP)
**After M4:** M5 (Dashboard Full)
**After M5:** M6 (Load Testing, Sharding, Security, Launch)

---

## Version History

| Version | Date | Milestone | Changes |
|---------|------|-----------|---------|
| v1.0.0 | 2026-06-19 | Initial Scaffold | Project structure, all shells, Git repo |
| v1.1.0 | 2026-06-20 | M1 Complete | Bot core, 6 modules, mod commands, logging |
| **v2.0.0** | **TBD** | **M2 Complete** | **19 modules, punishment ladder, media security** |
| v3.0.0 | TBD | M3 Complete | Report pipeline, review queue, auto-action |
| v4.0.0 | TBD | M4 Complete | Dashboard MVP (OAuth2, Overview, AutoMod, Reports) |
| v5.0.0 | TBD | M5 Complete | Dashboard Full (all pages, live sync, audit trail) |
| v6.0.0 | TBD | M6 Complete | Production launch (sharding, security, docs) |

---

**End of Master Plan**