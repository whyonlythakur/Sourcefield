# AutoMod Pro — In Progress & Master Plan

> **Last Updated:** 2026-06-20  
> **Current Version:** v1.1.0  
> **Current Sprint:** M2 — Remaining 19 Modules + Punishment Ladder Engine  
> **Overall Progress:** 19% (15/78 tasks)

---

## PHASED EXECUTION PLAN

---

## M1 — Core Bot + 6 Priority Modules ✅ **COMPLETE**

**Status:** 100% ✅  
**Estimated:** 8-10 hours  
**Actual:** ~12 hours  
**Completion Date:** 2026-06-20

### M1.1 ✅ Database + Bot Login
- **Files:** `src/index.js`, `src/config.js`
- **Status:** DONE
- **Implementation:** Config validation, graceful shutdown (SIGINT/SIGTERM), MongoDB Atlas + Redis Cloud connections

### M1.2 ✅ Guild Model Integration
- **Files:** `src/bot.js`, `src/events/guildCreate.js`, `src/events/guildDelete.js`
- **Status:** DONE
- **Implementation:** `client.db` namespace (Guild, Case, User, MediaCase), auto-create Guild docs on join

### M1.3 ✅ Permission Middleware
- **Files:** `src/middleware/permissions.js`
- **Status:** DONE
- **Implementation:** 4-tier system (BOT_OWNER, SERVER_OWNER, BOT_ADMIN, BOT_MODERATOR, REPORTER), `getTier()`, `hasPermission()`

### M1.4 ✅ Staff System Commands
- **Files:** `src/commands/config/staff.js`
- **Status:** DONE
- **Implementation:** `/staff add` / `/staff remove` with permission checks, DB persistence in Guild.staff[]

### M1.5 ✅ Spam Detection Module
- **Files:** `src/modules/spam.js`
- **Status:** DONE
- **Implementation:** Redis-based frequency tracking (5s window, 5 msg threshold), sorted set for sliding window

### M1.6 ✅ Mass Mention Filter
- **Files:** `src/modules/massMention.js`
- **Status:** DONE
- **Implementation:** Count @everyone, @here, user mentions
- **Trigger threshold:** >5 mentions
- **Confidence:** 70% + (mentions - threshold) * 10

### M1.7 ✅ Profanity Filter
- **Files:** `src/modules/profanity.js`
- **Status:** DONE
- **Implementation:** Regex wordlist matching (EN), severe pattern detection (slurs weighted 3x)
- **Patterns:** 8 common + 2 severe categories

### M1.8 ✅ Invite Link Filter
- **Files:** `src/modules/inviteFilter.js`
- **Status:** DONE
- **Implementation:** Detect discord.gg/xxxx, discord.com/invite/xxxx URLs
- **Whitelist support:** Guild.modules.inviteFilter.whitelist[]

### M1.9 ✅ External Link Filter
- **Files:** `src/modules/externalLinks.js`
- **Status:** DONE
- **Implementation:** URL detection + domain allow/block lists
- **Storage:** Guild.modules.externalLinks.allowedDomains[], blockedDomains[]

### M1.10 ✅ Anti-Raid Module
- **Files:** `src/modules/antiRaid.js`, `src/events/guildMemberAdd.js`
- **Status:** DONE
- **Implementation:** Track join rate in Redis (60s window), auto-alert in raidLogs channel
- **Threshold:** 5 joins in 60s (configurable)

### M1.11 ✅ Log Handler
- **Files:** `src/handlers/logHandler.js`, `src/utils/embeds.js`
- **Status:** DONE
- **Implementation:** 8 routable categories, color-coded embeds (buildLogEmbed, buildCaseEmbed, buildModActionEmbed)

### M1.12 ✅ Moderation Commands
- **Files:** `src/commands/moderation/{warn,mute,kick,ban,unban,unmute}.js`
- **Status:** DONE
- **Implementation:** Execute punishments, log to modActions, DM offender, create Case docs
- **Commands:** /warn, /mute (duration parsing), /unmute, /kick, /ban (temp/permanent), /unban

### M1.13 ✅ Message Handler Integration
- **Files:** `src/handlers/messageHandler.js`
- **Status:** DONE
- **Implementation:** Wire modules → auto case creation via reportHandler

### M1.14 ✅ Member Handler Integration
- **Files:** `src/handlers/memberHandler.js`
- **Status:** DONE
- **Implementation:** Wire raid detection (Redis join tracking), new account checks (account age < threshold days), auto-kick option

### M1.15 ✅ Report + Flag Commands
- **Files:** `src/commands/moderation/report.js`, `flag.js`
- **Status:** DONE
- **Implementation:** Create Case docs, staff ping for reports, message link parsing for flags

---

### M1 Deliverables ✅
- ✅ Bot can login + connect to MongoDB/Redis
- ✅ Staff management working (/staff add/remove)
- ✅ 6 modules detecting violations (spam, massMention, profanity, inviteFilter, externalLinks, antiRaid)
- ✅ Auto-created cases (from modules + manual reports/flags)
- ✅ Log channel routing (8 categories with color-coded embeds)
- ✅ Basic mod commands (/warn, /mute, /kick, /ban, /unban, /unmute)
- ✅ Report + Flag commands
- ✅ User warn points tracking

---

## M2 — Remaining 19 Modules + Punishment Engine ⏳ **NEXT**

**Status:** 0% ⏳  
**Estimated:** 12-15 hours

### M2.1 ⏳ Punishment Ladder Engine
- **Files:** `src/handlers/actionHandler.js`, `src/modules/warnSystem.js`
- **Implementation:** Point-based escalation (3 warns = mute, 5 = kick, 7 = ban)
- **Effort:** 2 hours

### M2.2 ⏳ Duplicate Message Detection
- **Files:** `src/modules/duplicate.js`
- **Implementation:** Same content across channels (3 strikes)
- **Effort:** 30 min

### M2.3 ⏳ Mass Emoji/Sticker Spam
- **Files:** `src/modules/massEmoji.js`
- **Implementation:** >10 emojis/stickers in message
- **Effort:** 30 min

### M2.4 ⏳ Caps Lock Filter
- **Files:** `src/modules/capsLock.js`
- **Implementation:** >70% uppercase characters
- **Effort:** 30 min

### M2.5 ⏳ Custom Blacklist
- **Files:** `src/modules/customBlacklist.js`, `src/commands/config/wordfilter.js`
- **Implementation:** Server-specific regex patterns, /wordfilter add/remove
- **Effort:** 1 hour

### M2.6 ⏳ Phishing/Scam Links
- **Files:** `src/modules/phishingLinks.js`
- **Integration:** Scam-link APIs (free tier)
- **Effort:** 1 hour

### M2.7 ⏳ NSFW Image Detection
- **Files:** `src/modules/nsfwImage.js`
- **Integration:** AI image scanning API (Hive Moderation free tier)
- **Effort:** 2 hours

### M2.8 ⏳ Zalgo/Unicode Abuse
- **Files:** `src/modules/zalgoFilter.js`
- **Implementation:** Detect excessive combining characters
- **Effort:** 45 min

### M2.9 ⏳ New Account Filter
- **Files:** `src/modules/newAccount.js`
- **Implementation:** Enhanced from M1 (kick/flag options)
- **Effort:** 45 min

### M2.10 ⏳ Alt Account Detection
- **Files:** `src/modules/altDetection.js`
- **Heuristics:** Avatar hash, join patterns, username similarity
- **Effort:** 1.5 hours

### M2.11 ⏳ Webhook Spam Protection
- **Files:** `src/modules/webhookSpam.js`, `src/events/webhookCreate.js`
- **Implementation:** Unauthorized webhook creation alerts
- **Effort:** 45 min

### M2.12 ⏳ Nickname Filter
- **Files:** `src/modules/nicknameFilter.js`, `src/events/guildMemberUpdate.js`
- **Implementation:** Offensive/impersonation detection
- **Effort:** 45 min

### M2.13 ⏳ Channel/Role Spam
- **Files:** `src/modules/channelRoleSpam.js`
- **Implementation:** Mass creation rate limiting
- **Effort:** 45 min

### M2.14 ⏳ Auto-Slowmode
- **Files:** `src/modules/autoSlowmode.js`
- **Implementation:** Dynamic slowmode on message velocity spikes
- **Effort:** 1 hour

### M2.15 ⏳ Token/IP Grabber Detection
- **Files:** `src/modules/tokenIpGrabber.js`
- **Implementation:** Known grabber URL patterns
- **Effort:** 45 min

### M2.16 ⏳ Selfbot Detection
- **Files:** `src/modules/selfbotDetection.js`
- **Heuristics:** Rapid messages, user bot=false, unusual patterns
- **Effort:** 1 hour

### M2.17 ⏳ Mute/Timeout Manager
- **Files:** `src/modules/muteManager.js`, `src/commands/moderation/mute.js`
- **Implementation:** Enhanced from M1 (queue for temp mutes)
- **Effort:** 1 hour

### M2.18 ⏳ Lockdown Mode
- **Files:** `src/modules/lockdown.js`, `src/commands/moderation/lockdown.js`
- **Implementation:** Server-wide channel lock
- **Effort:** 1 hour

### M2.19 ⏳ Verification Gate
- **Files:** `src/modules/verificationGate.js`, `src/commands/config/verification.js`
- **Implementation:** Captcha/reaction-role join gate
- **Effort:** 2 hours

### M2.20 ⏳ Media Security System (Module 26)
- **Files:** `src/modules/mediaSecurity.js`, `src/handlers/mediaReviewHandler.js`
- **Implementation:** Full §5A workflow (security levels: Low/Moderate/High, review queue, webhook relay)
- **Effort:** 4 hours

### M2.21 ⏳ Security Commands
- **Files:** `src/commands/security/index.js` (already scaffolded)
- **Implementation:** level, mediachannel, reviewchannel, trustedrole, autoescalate, status
- **Effort:** 2 hours

### M2.22 ⏳ Config Commands
- **Files:** `src/commands/config/{automod,raidmode,prefix,config}.js`
- **Implementation:** /automod module/threshold/punishment, /raidmode
- **Effort:** 2 hours

---

### M2 Deliverables
- All 26 modules functional
- Punishment ladder engine with auto-escalation
- Media review workflow (intercept → review → approve/reject → webhook relay)
- Full config command set
- Security command set

---

## M3 — Report → Review → Action Pipeline ⏳

**Status:** 0% ⏳  
**Estimated:** 6-8 hours  
**Dependencies:** M2.1 (Punishment ladder)

### M3.1 ⏳ Case Creation Pipeline
- **Files:** `src/handlers/reportHandler.js`
- **Implementation:** Auto-detect + manual report → unified Case
- **Effort:** 1.5 hours

### M3.2 ⏳ Confidence Scoring
- **Files:** `src/utils/confidence.js`, `src/handlers/reportHandler.js`
- **Auto-resolve logic:** >90% + low-severity = instant action
- **Effort:** 1 hour

### M3.3 ⏳ Review Queue Embeds
- **Files:** `src/handlers/reviewHandler.js`
- **Discord-side:** Embeds with ✅/❌ buttons
- **Effort:** 2 hours

### M3.4 ⏳ Action Handler
- **Files:** `src/handlers/actionHandler.js`
- **Implementation:** Execute punishment, DM offender, log audit
- **Effort:** 1.5 hours

### M3.5 ⏳ Case/History Commands
- **Files:** `src/commands/moderation/case.js`, `history.js`
- **Implementation:** /case view, /history @user
- **Effort:** 1 hour

---

### M3 Deliverables
- Unified case pipeline
- Review queue with button interactions
- Auto-action for high-confidence cases
- Full audit trail

---

## M4 — Dashboard MVP ⏳

**Status:** 0% ⏳  
**Estimated:** 15-20 hours  
**Dependencies:** M3 (case pipeline for Reports page data)

### M4.1 ⏳ Backend API Setup
- **Files:** `dashboard/src/app/api/` routes
- **Implementation:** Express/Next.js API routes, Discord OAuth2 (NextAuth)
- **Effort:** 4 hours

### M4.2 ⏳ Login + Server Switcher
- **Files:** `dashboard/src/app/login/page.tsx`, `select-server/page.tsx`
- **Effort:** 2 hours

### M4.3 ⏳ Overview Page
- **Files:** `dashboard/src/app/[guildId]/overview/page.tsx`
- **Implementation:** Stat cards, charts (recharts or chart.js)
- **Effort:** 3 hours

### M4.4 ⏳ Automod Config Page
- **Files:** `dashboard/src/app/[guildId]/automod/page.tsx`
- **Implementation:** Module toggle grid, threshold sliders
- **Effort:** 3 hours

### M4.5 ⏳ Reports Kanban
- **Files:** `dashboard/src/app/[guildId]/reports/page.tsx`
- **Implementation:** Pending | In Review | Resolved columns
- **Effort:** 3 hours

### M4.6 ⏳ WebSocket Integration
- **Files:** `dashboard/src/lib/socket.ts`, backend Socket.IO server
- **Implementation:** Live stats, report queue updates
- **Effort:** 3 hours

---

### M4 Deliverables
- Working dashboard with OAuth2
- Overview + Automod config + Reports pages
- Live WebSocket updates

---

## M5 — Dashboard Full ⏳

**Status:** 0% ⏳  
**Estimated:** 12-15 hours  
**Dependencies:** M4 (API + WebSocket foundation)

### M5.1 ⏳ Cases Page
- **Files:** `dashboard/src/app/[guildId]/cases/page.tsx`
- **Implementation:** Searchable table, detail view
- **Effort:** 2 hours

### M5.2 ⏳ Logs Page
- **Files:** `dashboard/src/app/[guildId]/logs/page.tsx`
- **Implementation:** Channel router + live tail feed
- **Effort:** 3 hours

### M5.3 ⏳ Staff Page
- **Files:** `dashboard/src/app/[guildId]/staff/page.tsx`
- **Implementation:** Role management, hierarchy diagram
- **Effort:** 2 hours

### M5.4 ⏳ Media Security Page
- **Files:** `dashboard/src/app/[guildId]/media-security/page.tsx`
- **Implementation:** Level selector, review queue sync
- **Effort:** 2 hours

### M5.5 ⏳ User Profile Page
- **Files:** `dashboard/src/app/[guildId]/users/[id]/page.tsx`
- **Implementation:** Warn gauge, timeline, action panel
- **Effort:** 2 hours

### M5.6 ⏳ Settings + Audit Pages
- **Files:** `dashboard/src/app/[guildId]/settings/page.tsx`, `audit/page.tsx`
- **Effort:** 2 hours

### M5.7 ⏳ Dashboard ↔ Command Sync
- **Implementation:** All settings readable/writable via both surfaces
- **Effort:** 2 hours

---

### M5 Deliverables
- Full dashboard parity with commands
- Every setting changeable via dashboard
- Audit trail for all changes

---

## M6 — Load Testing, Sharding, Security, Launch ⏳

**Status:** 0% ⏳  
**Estimated:** 8-10 hours

### M6.1 ⏳ ShardingManager
- **Files:** `src/shard.js`
- **Implementation:** Discord.js sharding for large guild counts
- **Effort:** 2 hours

### M6.2 ⏳ Security Hardening
- **Implementation:** OAuth2 token encryption, server-side role enforcement, API rate limiting
- **Effort:** 2 hours

### M6.3 ⏳ Load Testing
- **Implementation:** Spam simulation scripts, raid simulation, concurrent dashboard users
- **Effort:** 2 hours

### M6.4 ⏳ BullMQ Integration
- **Implementation:** Punishment scheduling (auto-unmute, temp-ban expiry)
- **Effort:** 2 hours

### M6.5 ⏳ Documentation
- **Implementation:** SETUP.md, MODULES.md, COMMANDS.md, DASHBOARD.md, TROUBLESHOOTING.md
- **Effort:** 2 hours

---

### M6 Deliverables
- Production-ready bot
- <1s detection-to-action benchmark
- Full documentation

---

## DEPENDENCIES GRAPH

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

### Key Dependencies
- **M2.1 (Punishment ladder)** required before M3 can execute auto-punishments
- **M3 (case pipeline)** required before M4 (Reports page needs case data)
- **M4 (API + WebSocket)** required before M5 (dashboard pages build on foundation)
- **M2.20 (Media Security)** is standalone but complex — may need dedicated focus

---

## PROGRESS SUMMARY

| Milestone | Tasks | Complete | Remaining | % Done | Status |
|-----------|-------|----------|-----------|--------|--------|
| **M1** | 15 | 15 | 0 | **100%** | ✅ Complete |
| **M2** | 22 | 0 | 22 | **0%** | ⏳ Next |
| **M3** | 5 | 0 | 5 | **0%** | ⏳ Pending |
| **M4** | 6 | 0 | 6 | **0%** | ⏳ Pending |
| **M5** | 7 | 0 | 7 | **0%** | ⏳ Pending |
| **M6** | 5 | 0 | 5 | **0%** | ⏳ Pending |
| **TOTAL** | **60** | **15** | **45** | **25%** | **In Progress** |

---

## TIME TRACKING

| Milestone | Estimated | Actual | Variance |
|-----------|-----------|--------|----------|
| M1 | 8-10 hours | ~12 hours | +2 hours |
| M2 | 12-15 hours | - | - |
| M3 | 6-8 hours | - | - |
| M4 | 15-20 hours | - | - |
| M5 | 12-15 hours | - | - |
| M6 | 8-10 hours | - | - |
| **TOTAL** | **61-78 hours** | **~12 hours** | **-** |

---

## CURRENT BLOCKERS & NOTES

### Current Blockers
- None

### Upcoming Considerations
- **NSFW Image Detection (M2.7):** Requires external API integration. Using free tier of Hive Moderation or similar.
- **Phishing Link Detection (M2.6):** May integrate with free scam-link APIs or use regex-based detection.
- **Media Security System (M2.20):** Most complex module — requires dedicated webhook management, review queue, and approval workflow.

---

## VERSION HISTORY

| Version | Date | Milestone | Status |
|---------|------|-----------|--------|
| v1.0.0 | 2026-06-19 | Initial Scaffold | ✅ Complete |
| v1.1.0 | 2026-06-20 | M1 Complete | ✅ Complete |
| **v2.0.0** | **TBD** | **M2 Complete** | ⏳ In Progress |
| v3.0.0 | TBD | M3 Complete | ⏳ Pending |
| v4.0.0 | TBD | M4 Complete | ⏳ Pending |
| v5.0.0 | TBD | M5 Complete | ⏳ Pending |
| v6.0.0 | TBD | M6 Complete | ⏳ Pending |

---

**Next Action:** Begin M2 implementation starting with M2.1 (Punishment Ladder Engine)