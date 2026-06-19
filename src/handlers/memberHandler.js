const { sendLog } = require('./logHandler');

async function handleMemberAdd(member, client) {
  if (member.user.bot) return;

  const guildId = member.guild.id;
  const guildDoc = await client.db.Guild.findOne({ guildId });
  if (!guildDoc) return;

  const key = `raid:${guildId}`;
  const recentJoins = await client.redis.zrangebyscore(key, Date.now() - 60000, Date.now());
  const raidThreshold = guildDoc.modules?.antiRaid?.threshold || 5;

  if (recentJoins.length >= raidThreshold) {
    const raidKey = `raid_active:${guildId}`;
    const wasAlreadyActive = await client.redis.get(raidKey);

    if (!wasAlreadyActive) {
      await client.redis.setex(raidKey, 300, '1');

      const raidChannel = guildDoc.logChannels.raidLogs 
        ? client.channels.cache.get(guildDoc.logChannels.raidLogs)
        : null;

      if (raidChannel) {
        await raidChannel.send({
          content: `🚨 **RAID DETECTED** 🚨\n\n${recentJoins.length} members joined in the last 60 seconds.\n\nAuto-lockdown recommended. Use \`/lockdown on\` to enable.`,
        }).catch(() => {});
      }

      await sendLog(client, guildId, 'raidLogs', {
        title: 'Raid Detected',
        description: `${recentJoins.length} members joined in 60 seconds`,
        fields: [{ name: 'Threshold', value: `${raidThreshold}`, inline: true }],
      });
    }
  }

  const accountAgeMs = Date.now() - member.user.createdTimestamp;
  const accountAgeDays = Math.floor(accountAgeMs / 86400000);
  const newAccountThreshold = guildDoc.modules?.newAccount?.threshold || 7;

  if (accountAgeDays < newAccountThreshold && guildDoc.modules?.newAccount?.enabled) {
    await sendLog(client, guildId, 'memberLogs', {
      title: 'New Account Joined',
      description: `<@${member.user.id}> joined (account age: ${accountAgeDays} days)`,
      fields: [
        { name: 'Account Created', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`, inline: true },
        { name: 'Threshold', value: `${newAccountThreshold} days`, inline: true },
      ],
    });

    if (guildDoc.modules?.newAccount?.action === 'kick') {
      try {
        await member.kick(`Account age < ${newAccountThreshold} days (AutoMod)`);
        await sendLog(client, guildId, 'modActions', {
          title: 'Auto-Kicked',
          description: `Kicked <@${member.user.id}> for being a new account (${accountAgeDays} days old)`,
        });
      } catch (err) {
        console.error('[MemberHandler] Failed to kick new account:', err.message);
      }
    }
  }

  await client.db.User.findOneAndUpdate(
    { userId: member.user.id, guildId },
    {
      userId: member.user.id,
      guildId,
      flags: {
        isAltSuspect: false,
        accountAgeAtJoin: accountAgeDays,
      },
    },
    { upsert: true, new: true },
  );
}

module.exports = { handleMemberAdd };