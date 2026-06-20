# AutoMod Pro — Task List

> **Last Updated:** 2026-06-20  
> **Current Version:** v2.0.0 (M2 Complete)  
> **Overall Progress:** 53% (42/78 tasks)

---

## ✅ M1 — Core Bot + Priority Modules (6 modules) — **COMPLETE**

All tasks completed. See completed.md for details.

---

## ✅ M2 — Remaining 19 Modules + Punishment Ladder Engine — **COMPLETE**

All 22 tasks completed:

- [x] [P0] Punishment ladder engine (warn→mute→kick→ban per module, point thresholds)
- [x] [P0] Module: Duplicate/Copy-paste Detection
- [x] [P0] Module: Mass Emoji / Sticker Spam
- [x] [P0] Module: Caps Lock Filter
- [x] [P1] Module: Custom Word/Phrase Blacklist
- [x] [P1] Module: Phishing/Scam Link Detection
- [x] [P1] Module: NSFW Image Detection
- [x] [P1] Module: Zalgo / Unicode Abuse
- [x] [P1] Module: New Account Filter
- [x] [P1] Module: Alt Account Detection
- [x] [P1] Module: Webhook/Bot Spam Protection
- [x] [P1] Module: Nickname Filter
- [x] [P1] Module: Channel/Role Spam Protection
- [x] [P1] Module: Auto-Slowmode
- [x] [P1] Module: Token/IP Grabber Link Detection
- [x] [P1] Module: Selfbot Detection
- [x] [P1] Module: Warn System (point-based auto-escalation)
- [x] [P1] Module: Mute/Timeout Manager
- [x] [P1] Module: Lockdown Mode
- [x] [P1] Module: Verification Gate
- [x] [P1] Module: Media Security System (full workflow)
- [x] [P1] /wordfilter add/remove commands
- [x] [P1] /linkfilter allow/block commands
- [x] [P2] Security commands: /security level, mediachannel, reviewchannel, trustedrole, autoescalate, status
- [x] [P2] /automod module enable/disable command
- [x] [P2] /automod threshold command
- [x] [P2] /automod punishment command
- [x] [P2] /raidmode on/off/auto command

---

## ⏳ M3 — Report → Review → Action Pipeline (Discord-side)

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

---

## ⏳ M4 — Dashboard MVP

- [ ] [P0] Discord OAuth2 login flow
- [ ] [P0] Server switcher + guild selection
- [ ] [P0] Overview page: stat cards, charts, activity feed
- [ ] [P0] Automod config page: module toggle grid + threshold sliders
- [ ] [P0] Reports kanban page: Pending | In Review | Resolved columns
- [ ] [P1] WebSocket integration (Socket.IO) for live stats + report queue
- [ ] [P1] Sidebar + topbar layout
- [ ] [P2] Component library build-out: StatCard, ModuleToggleCard, KanbanColumn, ReportDrawer, etc.

---

## ⏳ M5 — Dashboard Full

- [ ] [P0] Cases page: searchable history table + detail view
- [ ] [P0] Logs page: channel router + live tail feed
- [ ] [P0] Staff page: role management + hierarchy diagram
- [ ] [P0] Media Security page: level selector, channel bindings, review queue
- [ ] [P1] User profile page: warn gauge, timeline, action panel
- [ ] [P1] Settings page: prefix, verification, danger zone
- [ ] [P1] Audit trail page
- [ ] [P2] Dashboard ↔ command config sync (every setting readable/writable both ways)
- [ ] [P2] PDF export for case details

---

## ⏳ M6 — Load Testing, Sharding, Security, Launch

- [ ] [P0] Discord.js ShardingManager setup
- [ ] [P0] Security review: OAuth2 token encryption, server-side role enforcement, API rate limiting
- [ ] [P1] Load testing: spam simulation, raid simulation, concurrent dashboard users
- [ ] [P1] Redis counter persistence across bot restarts
- [ ] [P1] BullMQ integration for punishment scheduling (auto-unmute, temp-ban expiry)
- [ ] [P2] <1s median detection-to-action benchmark
- [ ] [P2] 100% report routing verification (zero silent drops)
- [ ] [P2] Documentation: setup guide, module reference, dashboard guide
- [ ] [P2] Launch checklist

---

## Progress Summary

| Milestone | Tasks | Complete | Remaining | % Done |
|-----------|-------|----------|-----------|--------|
| **M1** | 15 | 15 | 0 | **100%** |
| **M2** | 22 | 22 | 0 | **100%** |
| **M3** | 10 | 0 | 10 | **0%** |
| **M4** | 7 | 0 | 7 | **0%** |
| **M5** | 9 | 0 | 9 | **0%** |
| **M6** | 9 | 0 | 9 | **0%** |
| **TOTAL** | **72** | **37** | **35** | **51%** |