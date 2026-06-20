# AutoMod Pro — In Progress & Master Plan

> **Last Updated:** 2026-06-20  
> **Current Version:** v2.0.0  
> **Current Sprint:** M3 — Report → Review → Action Pipeline  
> **Overall Progress:** 51% (37/72 tasks)

---

## PHASED EXECUTION PLAN

---

## M1 — Core Bot + 6 Priority Modules ✅ **COMPLETE**

**Status:** 100% ✅  
**Completion Date:** 2026-06-20  
**Version:** v1.1.0

All 15 tasks completed. See completed.md for full details.

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

## M2 — Remaining 19 Modules + Punishment Engine ✅ **COMPLETE**

**Status:** 100% ✅  
**Completion Date:** 2026-06-20  
**Version:** v2.0.0

### M2.1 ✅ Punishment Ladder Engine
- **Files:** `src/handlers/actionHandler.js`, `src/modules/warnSystem.js`
- **Implementation:** Point-based escalation (3 warns = mute, 5 = kick, 7 = ban)
- **Status:** DONE

### M2.2 ✅ Duplicate Message Detection
- **Files:** `src/modules/duplicate.js`
- **Implementation:** Redis-based, 5min window, 3 strikes
- **Status:** DONE

### M2.3 ✅ Mass Emoji/Sticker Spam
- **Files:** `src/modules/massEmoji.js`
- **Implementation:** >10 emojis/stickers, Unicode + custom emoji
- **Status:** DONE

### M2.4 ✅ Caps Lock Filter
- **Files:** `src/modules/capsLock.js`
- **Implementation:** >70% uppercase characters
- **Status:** DONE

### M2.5 ✅ Custom Blacklist
- **Files:** `src/modules/customBlacklist.js`, `src/commands/config/wordfilter.js`
- **Implementation:** Server-specific regex patterns, /wordfilter add/remove/list
- **Status:** DONE

### M2.6 ✅ Phishing/Scam Links
- **Files:** `src/modules/phishingLinks.js`
- **Implementation:** Known phishing domains, suspicious TLD detection
- **Status:** DONE

### M2.7 ✅ NSFW Image Detection
- **Files:** `src/modules/nsfwImage.js`
- **Implementation:** Keyword + filename analysis, non-NSFW channel only
- **Status:** DONE

### M2.8 ✅ Zalgo/Unicode Abuse
- **Files:** `src/modules/zalgoFilter.js`
- **Implementation:** Combining mark detection, >30% ratio
- **Status:** DONE

### M2.9 ✅ New Account Filter
- **Files:** `src/modules/newAccount.js`
- **Implementation:** Account age < threshold days, auto-kick option
- **Status:** DONE

### M2.10 ✅ Alt Account Detection
- **Files:** `src/modules/altDetection.js`
- **Implementation:** Account age + join age + heuristics
- **Status:** DONE

### M2.11 ✅ Webhook Spam Protection
- **Files:** `src/modules/webhookSpam.js`
- **Implementation:** Unauthorized webhook rate limiting
- **Status:** DONE

### M2.12 ✅ Nickname Filter
- **Files:** `src/modules/nicknameFilter.js`
- **Implementation:** Offensive + impersonation detection
- **Status:** DONE

### M2.13 ✅ Channel/Role Spam
- **Files:** `src/modules/channelRoleSpam.js`
- **Implementation:** Mass creation rate tracking
- **Status:** DONE

### M2.14 ✅ Auto-Slowmode
- **Files:** `src/modules/autoSlowmode.js`
- **Implementation:** Dynamic slowmode on high message velocity
- **Status:** DONE

### M2.15 ✅ Token/IP Grabber Detection
- **Files:** `src/modules/tokenIpGrabber.js`
- **Implementation:** Grabber keywords + URL shorteners
- **Status:** DONE

### M2.16 ✅ Selfbot Detection
- **Files:** `src/modules/selfbotDetection.js`
- **Implementation:** Rapid message patterns, <1s intervals
- **Status:** DONE

### M2.17 ✅ Mute/Timeout Manager
- **Files:** `src/modules/muteManager.js`
- **Implementation:** Tracks active mutes, remaining time
- **Status:** DONE

### M2.18 ✅ Lockdown Mode
- **Files:** `src/modules/lockdown.js`, `src/commands/moderation/lockdown.js`
- **Implementation:** Server-wide channel lock with enable/disable functions
- **Status:** DONE

### M2.19 ✅ Verification Gate
- **Files:** `src/modules/verificationGate.js`
- **Implementation:** Unverified user detection, gate role check
- **Status:** DONE

### M2.20 ✅ Media Security System (Module 26)
- **Files:** `src/modules/mediaSecurity.js`
- **Implementation:** Security levels (Low/Moderate/High), media channel, trusted role, auto-intercept
- **Status:** DONE

### M2.21 ✅ Security Commands
- **Files:** `src/commands/security/index.js`
- **Implementation:** level, mediachannel, reviewchannel, trustedrole, autoescalate, status
- **Status:** DONE

### M2.22 ✅ Config Commands
- **Files:** `src/commands/config/automod.js`, `raidmode.js`
- **Implementation:** /automod module/threshold/punishment, /raidmode on/off/auto
- **Status:** DONE

---

### M2 Deliverables ✅
- ✅ All 26 modules functional
- ✅ Punishment ladder engine with auto-escalation
- ✅ Media Security System (full §5A workflow foundation)
- ✅ Full config command set
- ✅ Security command set

---

## M3 — Report → Review → Action Pipeline ⏳ **NEXT**

**Status:** 0% ⏳  
**Estimated:** 6-8 hours  
**Dependencies:** M2.1 (Punishment ladder) ✅

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

### M3.4 ⏳ Action Handler (Enhanced)
- **Files:** `src/handlers/actionHandler.js` (already implemented in M2)
- **Enhancement:** Media review workflow integration
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
M2 (19 modules + ladder engine) ✅
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
- ✅ **M2.1 (Punishment ladder)** COMPLETE — M3 can now execute auto-punishments
- ⏳ **M3 (case pipeline)** required before M4 (Reports page needs case data)
- ⏳ **M4 (API + WebSocket)** required before M5 (dashboard pages build on foundation)
- ✅ **M2.20 (Media Security)** COMPLETE — M3 media review workflow can integrate

---

## PROGRESS SUMMARY

| Milestone | Tasks | Complete | Remaining | % Done | Status |
|-----------|-------|----------|-----------|--------|--------|
| **M1** | 15 | 15 | 0 | **100%** | ✅ Complete |
| **M2** | 22 | 22 | 0 | **100%** | ✅ Complete |
| **M3** | 10 | 0 | 10 | **0%** | ⏳ Next |
| **M4** | 7 | 0 | 7 | **0%** | ⏳ Pending |
| **M5** | 9 | 0 | 9 | **0%** | ⏳ Pending |
| **M6** | 9 | 0 | 9 | **0%** | ⏳ Pending |
| **TOTAL** | **72** | **37** | **35** | **51%** | **In Progress** |

---

## TIME TRACKING

| Milestone | Estimated | Actual | Variance |
|-----------|-----------|--------|----------|
| M1 | 8-10 hours | ~12 hours | +2 hours |
| M2 | 12-15 hours | ~8 hours | -4 hours |
| M3 | 6-8 hours | - | - |
| M4 | 15-20 hours | - | - |
| M5 | 12-15 hours | - | - |
| M6 | 8-10 hours | - | - |
| **TOTAL** | **61-78 hours** | **~20 hours** | **-** |

---

## CURRENT BLOCKERS & NOTES

### Current Blockers
- None

### Upcoming Considerations
- **M3.3 (Review Queue):** Need to implement Discord button interactions (requires discord.js v14 ButtonBuilder)
- **M3.5 (Media Review Workflow):** Complex workflow — may need dedicated focus
- **M4 (Dashboard):** Requires Discord OAuth2 app setup in Discord Developer Portal

---

## VERSION HISTORY

| Version | Date | Milestone | Status |
|---------|------|-----------|--------|
| v1.0.0 | 2026-06-19 | Initial Scaffold | ✅ Complete |
| v1.1.0 | 2026-06-20 | M1 Complete | ✅ Complete |
| v2.0.0 | 2026-06-20 | M2 Complete | ✅ Complete |
| **v3.0.0** | **TBD** | **M3 Complete** | ⏳ In Progress |
| v4.0.0 | TBD | M4 Complete | ⏳ Pending |
| v5.0.0 | TBD | M5 Complete | ⏳ Pending |
| v6.0.0 | TBD | M6 Complete | ⏳ Pending |

---

**Next Action:** Begin M3 implementation starting with M3.1 (Case Creation Pipeline enhancement)