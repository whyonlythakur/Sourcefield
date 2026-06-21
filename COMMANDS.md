# AutoMod Pro — Command Reference

## Moderation Commands

### /warn
Warn a user and add points to their record.

**Usage:**
```
/warn @user [reason]
```

**Permissions:** Mod+
**Aliases:** None

---

### /mute
Mute (timeout) a user for specified duration.

**Usage:**
```
/mute @user [duration] [reason]
```

**Duration Format:** `1h`, `30m`, `2d`, `1w`
**Permissions:** Mod+
**Aliases:** timeout

---

### /unmute
Remove mute from a user.

**Usage:**
```
/unmute @user [reason]
```

**Permissions:** Mod+
**Aliases:** untimeout

---

### /kick
Kick a user from the server.

**Usage:**
```
/kick @user [reason]
```

**Permissions:** Admin+
**Aliases:** None

---

### /ban
Ban a user from the server.

**Usage:**
```
/ban @user [reason] [deleteMessageSeconds]
```

**Delete Messages:** 0-604800 (7 days)
**Permissions:** Admin+
**Aliases:** None

---

### /unban
Unban a previously banned user.

**Usage:**
```
/unban [user_id] [reason]
```

**Permissions:** Admin+
**Aliases:** None

---

## Staff Management

### /staff add
Add a user to the staff team.

**Usage:**
```
/staff add @user [role]
```

**Roles:** `owner`, `admin`, `mod`, `reporter`
**Permissions:** Owner only

---

### /staff remove
Remove a user from the staff team.

**Usage:**
```
/staff remove @user
```

**Permissions:** Owner only

---

### /staff list
List all staff members.

**Usage:**
```
/staff list
```

**Permissions:** Reporter+

---

## AutoMod Configuration

### /automod module
Enable or disable a specific module.

**Usage:**
```
/automod module [name] [enable/disable]
```

**Example:**
```
/automod module spam enable
/automod module invite disable
```

**Permissions:** Admin+

---

### /automod threshold
Set the threshold for a module.

**Usage:**
```
/automod threshold [name] [value]
```

**Example:**
```
/automod threshold spam 10
/automod threshold massMention 3
```

**Permissions:** Admin+

---

### /automod punishment
Set the punishment type for a module.

**Usage:**
```
/automod punishment [name] [type]
```

**Types:** `warn`, `mute`, `kick`, `ban`
**Permissions:** Admin+

---

### /wordfilter add
Add a word/phrase to the blacklist.

**Usage:**
```
/wordfilter add [pattern]
```

**Permissions:** Admin+

---

### /wordfilter remove
Remove a word/phrase from the blacklist.

**Usage:**
```
/wordfilter remove [pattern]
```

**Permissions:** Admin+

---

### /wordfilter list
List all blacklisted words.

**Usage:**
```
/wordfilter list
```

**Permissions:** Admin+

---

### /raidmode
Enable or disable raid mode.

**Usage:**
```
/raidmode [on/off/auto]
```

**Modes:**
- `on` - Always active
- `off` - Disabled
- `auto` - Automatically activates on raid detection

**Permissions:** Admin+

---

## Security Commands

### /security level
Set the media security level.

**Usage:**
```
/security level [low/moderate/high]
```

**Levels:**
- `low` - Allow up to 2 attachments
- `moderate` - Allow 1 attachment
- `high` - No attachments without trusted role

**Permissions:** Admin+

---

### /security mediachannel
Set the designated media channel.

**Usage:**
```
/security mediachannel [#channel]
```

**Permissions:** Admin+

---

### /security reviewchannel
Set the channel for media review queue.

**Usage:**
```
/security reviewchannel [#channel]
```

**Permissions:** Admin+

---

### /security trustedrole
Set the trusted media uploader role.

**Usage:**
```
/security trustedrole [@role]
```

**Permissions:** Admin+

---

### /security autoescalate
Enable or disable auto-escalation.

**Usage:**
```
/security autoescalate [on/off]
```

**Permissions:** Admin+

---

### /security status
View current security configuration.

**Usage:**
```
/security status
```

**Permissions:** Mod+

---

## Case Management

### /case view
View details of a specific case.

**Usage:**
```
/case view [case_id]
```

**Example:**
```
/case view AMP-1234567890-001
```

**Permissions:** Mod+

---

### /history
View a user's moderation history.

**Usage:**
```
/history @user
```

**Shows:** Last 10 cases, warn points, total cases
**Permissions:** Mod+

---

### /report
Report a user to staff (user-facing command).

**Usage:**
```
/report @user [reason]
```

**Permissions:** Everyone
**Cooldown:** 5 minutes

---

### /flag
Flag a message for staff review (staff-only).

**Usage:**
```
/flag [message_link] [reason]
```

**Permissions:** Reporter+

---

## Utility Commands

### /lockdown
Lock or unlock the server.

**Usage:**
```
/lockdown [on/off]
```

**Effect:** Disables send messages for @everyone
**Permissions:** Admin+

---

### /ping
Check bot latency.

**Usage:**
```
/ping
```

**Permissions:** Everyone

---

### /help
View available commands.

**Usage:**
```
/help [command]
```

**Permissions:** Everyone

---

## Permission Levels

| Level | Permissions | Commands |
|-------|-------------|----------|
| **Owner** | Server owner | All commands |
| **Admin** | Administrators | All except /staff |
| **Mod** | Moderators | Moderation + config |
| **Reporter** | Reporters | /flag, /report, /ping |
| **Everyone** | All users | /report, /ping, /help |

---

## Examples

### Full Moderation Flow

```bash
# Warn a user
/warn @Spammer Posting too fast

# Check their history
/history @Spammer

# If they continue, mute them
/mute @Spammer 1h Spamming

# If they still continue, ban them
/ban @Spammer Repeated spam 86400
```

### Setting Up AutoMod

```bash
# Enable spam detection
/automod module spam enable
/automod threshold spam 5

# Enable invite filter
/automod module invite enable
/automod punishment invite kick

# Set up media security
/security level moderate
/security mediachannel #media
```

### Staff Management

```bash
# Add a new moderator
/staff add @John mod

# Add an admin
/staff add @Jane admin

# List all staff
/staff list
```

---

## Notes

- All moderation actions are logged to the configured log channel
- Users receive DMs when warned, muted, kicked, or banned
- Cases are stored in the database for history tracking
- Commands support auto-complete in Discord