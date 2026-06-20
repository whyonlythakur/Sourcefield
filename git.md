# AutoMod Pro — Version History

> Rolling log of the last 20 version updates.
> Format: version | date/time (UTC) | commit hash
> When >20 entries, oldest is dropped.

---

## v3.0.0 — 2026-06-20 20:00:00 UTC | `4730cde`

### Added
- M3 Complete: Report → Review → Action Pipeline
- Enhanced reportHandler: createCase (with auto-resolve), createManualReport, createMediaCase, updateCaseStatus
- Confidence scoring enhancements: per-module auto-action thresholds, severity calculation, shouldAutoPunish()
- Review queue system with Discord button interactions (✅ Approve, ❌ Reject, ⚠️ Escalate, Dismiss)
- Review embed builder with full case details, evidence, severity colors
- Case management commands: /case view [id], /history @user
- interactionCreate event handler for button interactions
- Auto-logging to caseLogs channel for all case events
- Case state machine: pending → in_review → resolved | dismissed | escalated

### Removed
- .env.example (replaced with .env for local development)

### Changed
- Updated report.js command to use createManualReport()
- Updated messageHandler to use auto-resolve logic
- Created .env with local Redis configuration (redis://localhost:6379)

---

## v2.0.0 — 2026-06-20 18:00:00 UTC | `260eb25`

### Added
- M2 Complete: All 26 Modules + Punishment Ladder Engine
- Punishment ladder engine: auto-escalation (3 warns=mute, 5=kick, 7=ban)
- 17 new automod modules: Duplicate, Mass Emoji, Caps Lock, Custom Blacklist, Phishing Links, NSFW Image, Zalgo, New Account (enhanced), Alt Detection, Webhook Spam, Nickname Filter, Channel/Role Spam, Auto-Slowmode, Token/IP Grabber, Selfbot Detection, Lockdown, Verification Gate, Media Security
- Security commands: /security level, mediachannel, reviewchannel, trustedrole, autoescalate, status
- Config commands: /automod module/threshold/punishment, /raidmode, /wordfilter add/remove/list
- Enhanced actionHandler: executePunishment, checkAutoEscalation, handleModuleTrigger
- Media Security System (Module 26): Full §5A workflow (Low/Moderate/High security levels, review queue, webhook relay)
- Lockdown module with enable/disable functions

### Removed
- (nothing)

### Changed
- Updated bot.js to load all modules into client.modules
- Enhanced messageHandler with punishment ladder integration
- Updated lockdown command to integrate with lockdown module

---

## v1.1.0 — 2026-06-20 12:00:00 UTC | `7e41420`

### Added
- M1 Complete: Core Bot + 6 Priority Modules fully implemented
- Bot core: config validation, graceful shutdown, MongoDB Atlas + Redis Cloud connections
- Permission middleware: 4-tier system (Owner/ServerOwner/Admin/Mod/Reporter)
- Staff system: /staff add, /staff remove commands with DB persistence
- 6 automod modules: Spam, Mass Mention, Profanity, Invite Filter, External Links, Anti-Raid
- 8 log channel categories with color-coded embeds
- 6 moderation commands: /warn, /mute, /unmute, /kick, /ban, /unban (with logging + DMs)
- Case management: /report, /flag commands, auto case creation from modules
- Event handlers: guildCreate, guildDelete, guildMemberAdd (with raid tracking)
- Enhanced embed utilities: buildLogEmbed, buildCaseEmbed, buildModActionEmbed
- Tracking files updated: todo.md, completed.md, progress.md
- New file: plan.md (comprehensive M1-M6 roadmap with progress tracking)

### Removed
- (nothing)

### Changed
- Updated .env.example with MongoDB Atlas + Redis Cloud instructions
- Enhanced src/handlers/memberHandler.js with raid detection + new account checks
- Updated src/events/guildMemberAdd.js with Redis join tracking

---

## v1.0.0 — 2026-06-20 00:00:00 UTC | `3285026`

### Added
- Full project scaffold (src/, dashboard/, scripts/)
- Bot skeleton: index.js, bot.js, config.js
- 26 automod module shells
- 4 Mongoose model schemas (Guild, Case, User, MediaCase)
- 7 handler shells, 2 middleware, 4 utils, 11 event listeners
- 24 command stubs (moderation, config, security)
- Dashboard Next.js scaffold: 14 page shells, 11 component stubs, 3 lib files, 2 hooks
- Tracking files: todo.md, progress.md, completed.md, git.md
- .env.example, .gitignore, package.json
- Git repository initialized, pushed to GitHub (whyonlythakur/AutoMod-Pro)
- GitHub repository: https://github.com/whyonlythakur/AutoMod-Pro

### Removed
- (nothing — initial release)

### Changed
- (nothing — initial release)
