# AutoMod Pro — Dashboard Guide

## Overview

AutoMod Pro includes a **full-featured web dashboard** for server management. The dashboard provides real-time stats, automod configuration, report management, and more.

## Accessing the Dashboard

1. Open your browser to the dashboard URL (default: http://localhost:3000)
2. Click **"Login with Discord"**
3. Authorize the application
4. Select your server from the list

## Dashboard Pages

### Overview (`/[guildId]/overview`)

**Features:**
- **Stat Cards:** Total members, active cases, auto-actions (24h), raid status
- **7-Day Action Chart:** Bar chart showing moderation actions over the last week
- **Case Breakdown:** Donut chart showing case types distribution
- **Live Activity Feed:** Real-time updates via Supabase Realtime

**Use Case:** Quick overview of server health and recent activity.

---

### AutoMod (`/[guildId]/automod`)

**Features:**
- **26 Module Cards:** Toggle switches for each automod module
- **Threshold Display:** Shows current threshold for each module
- **Quick Toggle:** Click to enable/disable modules instantly

**Use Case:** Configure which automod modules are active and their sensitivity.

---

### Reports (`/[guildId]/reports`)

**Features:**
- **Kanban Board:** Three columns (Pending, In Review, Resolved)
- **Status Management:** Move reports between statuses with buttons
- **Report Details:** Shows reporter, target, reason, and severity

**Use Case:** Manage user reports from submission to resolution.

**Workflow:**
1. New reports appear in **Pending**
2. Click **"Review"** to move to **In Review**
3. Investigate and take action
4. Click **"Resolve"** or **"Dismiss"** to close

---

### Cases (`/[guildId]/cases`)

**Features:**
- **Searchable Table:** Search by user ID or case ID
- **Filters:** Filter by type (spam, profanity, etc.) and status
- **Detail View:** Click any case to see full details
- **Pagination:** Navigate through case history

**Use Case:** Browse and search moderation history.

---

### Logs (`/[guildId]/logs`)

**Features:**
- **8 Log Categories:** Mod Actions, AutoMod Triggers, Message Logs, Member Logs, Raid Logs, Case Logs, Server Logs, Error Logs
- **Color Coding:** Each category has a unique color
- **Live Feed:** Real-time log entries
- **Category Filtering:** Click a category to filter logs

**Use Case:** Monitor server activity and debug issues.

---

### Staff (`/[guildId]/staff`)

**Features:**
- **Role-Based Grouping:** Staff organized by role (owner, admin, mod, reporter)
- **Hierarchy Diagram:** Visual representation of staff structure
- **Member Cards:** Shows when each staff member was added

**Use Case:** View and manage staff team structure.

---

### Media Security (`/[guildId]/media-security`)

**Features:**
- **Security Level Selector:** Low, Moderate, High
- **Channel Bindings:** Shows media channel, review channel, trusted role
- **Review Queue:** Pending media reviews with approve/reject buttons
- **Attachment Preview:** See images before approving

**Use Case:** Manage media upload restrictions and review queue.

**Workflow:**
1. Set security level (Low/Moderate/High)
2. Designate a media channel
3. Set up review channel for High security
4. Review pending submissions in the queue

---

### User Profile (`/[guildId]/users/[id]`)

**Features:**
- **User Overview:** Username, ID, first seen, last active
- **Warn Gauge:** Visual representation of warn points (0-10)
- **Case History:** Timeline of user's cases
- **Action Panel:** Quick actions (view history, clear warns)

**Use Case:** View individual user's moderation history and status.

**Warn Gauge Colors:**
- **Green:** 0-4 points (good standing)
- **Yellow:** 5-6 points (1 warning from auto-mute)
- **Orange:** 7-9 points (1 warning from auto-ban)
- **Red:** 10 points (auto-mute triggered)

---

### Settings (`/[guildId]/settings`)

**Features:**
- **General Settings:** Prefix, language, verification level
- **Log Channels:** Configure log channel for each category
- **Danger Zone:** Reset config, transfer ownership, remove bot

**Use Case:** Configure bot-wide settings.

---

### Audit (`/[guildId]/audit`)

**Features:**
- **Audit Trail:** Table of all moderation actions
- **Pagination:** Navigate through audit history
- **Details:** Shows action, moderator, target, reason, timestamp

**Use Case:** Track all moderation actions for accountability.

---

## Real-Time Features

### Supabase Realtime

The dashboard uses **Supabase Realtime** for live updates:

- **Live Activity Feed:** New cases appear instantly
- **Report Queue:** New reports appear without refresh
- **Logs Page:** Live log tail feed

No separate WebSocket server needed - all powered by Supabase.

---

## Authentication

### Discord OAuth2

- Uses NextAuth v4 with Discord provider
- Scopes: `identify`, `guilds`
- Only shows servers where:
  - User has **Manage Guild** or **Administrator** permission
  - Bot is present in the server

### Session Management

- Sessions stored securely with JWT
- Auto-refresh on activity
- Logout clears session

---

## Permissions

Dashboard respects the 4-tier staff system:

| Role | Dashboard Access |
|------|-----------------|
| **Owner** | Full access to all pages |
| **Admin** | Full access except Staff page |
| **Mod** | View-only for Overview, Cases, Logs; Edit for AutoMod, Reports |
| **Reporter** | View-only for Overview, Reports |

---

## Configuration Sync

All settings are **synced** between Discord commands and dashboard:

- Change a setting in dashboard → reflected in bot immediately
- Use Discord command → dashboard updates on next load

**Example:**
```bash
# Discord command
/automod module spam enable

# Dashboard
AutoMod page shows "Spam Detection" as Enabled ✅
```

---

## Troubleshooting

### Can't Login

- Ensure Discord OAuth2 is configured correctly
- Check that redirect URI matches exactly
- Verify `NEXTAUTH_SECRET` is set

### Server Not Showing

- Bot must be in the server
- You must have Manage Guild or Administrator permission
- Wait a few seconds and refresh

### Changes Not Saving

- Check browser console for errors
- Verify API routes are accessible
- Ensure Supabase connection is working

### Real-Time Updates Not Working

- Check that Supabase Realtime is enabled
- Verify `NEXT_PUBLIC_SUPABASE_URL` is set
- Check browser console for connection errors

---

## Development

### Running Locally

```bash
cd dashboard
npm install
npm run dev
```

Open http://localhost:3000

### Building for Production

```bash
npm run build
npm start
```

### Environment Variables

See [SETUP.md](./SETUP.md) for full environment variable reference.

---

## Future Features (M6+)

- PDF export for case details
- Advanced analytics dashboard
- Custom automod rules builder
- Bulk actions for reports/cases
- Mobile-responsive improvements

---

## Support

For dashboard issues, check:
- Browser console for errors
- Network tab for API failures
- Supabase dashboard for connection issues

Join the support server for additional help.