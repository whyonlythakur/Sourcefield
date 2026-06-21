# AutoMod Pro — Module Reference

## Overview

AutoMod Pro includes **26 automod modules** that detect and punish violations automatically. Each module can be enabled/disabled and configured independently.

## Module List

### 1. Spam Detection
- **Purpose:** Detects rapid message sending
- **Threshold:** 5 messages in 5 seconds
- **Default Punishment:** Warn
- **Config:** `/automod threshold spam [value]`

### 2. Mass Mention
- **Purpose:** Detects mass pings (@everyone, @here, user mentions)
- **Threshold:** 5+ mentions in one message
- **Default Punishment:** Warn
- **Config:** `/automod threshold massMention [value]`

### 3. Profanity Filter
- **Purpose:** Blocks offensive language
- **Detection:** Regex-based wordlist
- **Default Punishment:** Warn
- **Config:** `/automod threshold profanity [value]`

### 4. Invite Filter
- **Purpose:** Blocks Discord invite links
- **Detection:** `discord.gg` pattern
- **Default Punishment:** Warn
- **Config:** `/automod threshold invite [value]`

### 5. External Links
- **Purpose:** Controls allowed/blocked domains
- **Detection:** URL pattern matching
- **Default Punishment:** Warn
- **Config:** `/automod threshold externalLinks [value]`

### 6. Anti-Raid
- **Purpose:** Detects mass join raids
- **Threshold:** 10+ joins in 60 seconds
- **Default Punishment:** Lockdown
- **Config:** `/raidmode [on/off/auto]`

### 7. Duplicate Messages
- **Purpose:** Detects copy-paste spam
- **Threshold:** 3 identical messages in 5 minutes
- **Default Punishment:** Warn
- **Config:** `/automod threshold duplicate [value]`

### 8. Mass Emoji
- **Purpose:** Detects emoji spam
- **Threshold:** 10+ emoji/stickers in one message
- **Default Punishment:** Warn
- **Config:** `/automod threshold massEmoji [value]`

### 9. Caps Lock Filter
- **Purpose:** Detects excessive capitalization
- **Threshold:** >70% uppercase characters
- **Default Punishment:** Warn
- **Config:** `/automod threshold capsLock [value]`

### 10. Custom Blacklist
- **Purpose:** Blocks custom words/phrases
- **Config:** `/wordfilter add [pattern]`
- **Default Punishment:** Warn

### 11. Phishing Links
- **Purpose:** Blocks known scam/phishing domains
- **Detection:** Domain blacklist
- **Default Punishment:** Ban
- **Config:** `/automod threshold phishing [value]`

### 12. NSFW Image
- **Purpose:** Detects NSFW images in non-NSFW channels
- **Detection:** Filename + keyword analysis
- **Default Punishment:** Warn
- **Config:** `/automod threshold nsfw [value]`

### 13. Zalgo Filter
- **Purpose:** Detects text abuse (combining characters)
- **Threshold:** >30% combining marks
- **Default Punishment:** Warn
- **Config:** `/automod threshold zalgo [value]`

### 14. New Account Filter
- **Purpose:** Blocks very new accounts
- **Threshold:** Account age < 7 days (configurable)
- **Default Punishment:** Kick
- **Config:** `/automod threshold newAccount [value]`

### 15. Alt Detection
- **Purpose:** Detects alternate accounts
- **Detection:** Account age + join age heuristics
- **Default Punishment:** Kick
- **Config:** `/automod threshold altDetection [value]`

### 16. Webhook Spam
- **Purpose:** Detects unauthorized webhook spam
- **Threshold:** 5+ webhook messages in 10 seconds
- **Default Punishment:** Ban
- **Config:** `/automod threshold webhookSpam [value]`

### 17. Nickname Filter
- **Purpose:** Blocks offensive/impersonation nicknames
- **Detection:** Pattern matching
- **Default Punishment:** Warn + reset nickname
- **Config:** `/automod threshold nickname [value]`

### 18. Channel/Role Spam
- **Purpose:** Detects mass channel/role creation
- **Threshold:** 5+ creations in 60 seconds
- **Default Punishment:** Alert admins
- **Config:** `/automod threshold channelRoleSpam [value]`

### 19. Auto-Slowmode
- **Purpose:** Automatically enables slowmode during high activity
- **Threshold:** 20+ messages in 10 seconds
- **Default Action:** Set 10s slowmode
- **Config:** `/automod threshold autoSlowmode [value]`

### 20. Token/IP Grabber
- **Purpose:** Detects token grabber attempts
- **Detection:** Known grabber patterns + URL shorteners
- **Default Punishment:** Ban
- **Config:** `/automod threshold tokenIpGrabber [value]`

### 21. Selfbot Detection
- **Purpose:** Detects self-bots (user accounts running bots)
- **Threshold:** <1s message intervals
- **Default Punishment:** Ban
- **Config:** `/automod threshold selfbot [value]`

### 22. Warn System
- **Purpose:** Tracks user warnings
- **Auto-Escalation:** 3 warns = mute, 5 = kick, 7 = ban
- **Config:** Automatic

### 23. Mute Manager
- **Purpose:** Manages user timeouts
- **Config:** `/mute @user [duration] [reason]`

### 24. Lockdown
- **Purpose:** Locks down server during raids
- **Config:** `/lockdown [on/off]`

### 25. Verification Gate
- **Purpose:** Requires users to verify before participating
- **Config:** `/security verification [on/off]`

### 26. Media Security (Flagship)
- **Purpose:** Controls attachment uploads
- **Security Levels:**
  - **Low:** Up to 2 attachments per message
  - **Moderate:** 1 attachment per message
  - **High:** No attachments (requires trusted role)
- **Config:** 
  - `/security level [low/moderate/high]`
  - `/security mediachannel [#channel]`
  - `/security trustedrole [@role]`

## Configuration Commands

### Enable/Disable Module

```bash
/automod module [name] [enable/disable]
```

Example:
```bash
/automod module spam enable
/automod module invite disable
```

### Set Threshold

```bash
/automod threshold [name] [value]
```

Example:
```bash
/automod threshold spam 10
/automod threshold massMention 3
```

### Set Punishment

```bash
/automod punishment [name] [ladder]
```

Example:
```bash
/automod punishment spam warn
/automod punishment phishing ban
```

## Punishment Ladder

AutoMod Pro uses an escalating punishment system:

1. **Warn** - Adds warning points to user
2. **Mute** - Timeout for specified duration
3. **Kick** - Removes user from server
4. **Ban** - Permanently bans user

### Auto-Escalation (Warn System)

- **3 warns** = Automatic mute
- **5 warns** = Automatic kick
- **7 warns** = Automatic ban

## Module Confidence Scoring

Each module assigns a confidence score (0-100) to violations:

- **>90% confidence** = Auto-action (instant punishment)
- **70-90% confidence** = Review queue
- **<70% confidence** = Log only

## Best Practices

1. **Start Conservative:** Enable modules one at a time
2. **Monitor False Positives:** Check review queue regularly
3. **Adjust Thresholds:** Tune based on your community size
4. **Use Media Security:** Enable for high-traffic servers
5. **Enable Anti-Raid:** Set to "auto" for automatic lockdown

## Support

For module-specific issues, check the troubleshooting section or join the support server.