module.exports = {
  name: 'lockdown',
  enabled: false,
  threshold: 0,
  ladder: ['warn', 'mute', 'kick', 'ban'],
  async check(message, redisClient) {
    const key = `lockdown:${message.guild.id}`;
    const isActive = await redisClient.get(key);

    if (isActive === '1') {
      return {
        triggered: true,
        confidence: 100,
        evidence: {
          lockdownActive: true,
          reason: 'Server-wide lockdown is active',
        },
        severity: 'critical',
      };
    }

    return { triggered: false, confidence: 0, evidence: null };
  },
  async enableLockdown(guild, redisClient) {
    const key = `lockdown:${guild.id}`;
    await redisClient.setex(key, 3600, '1');

    const channels = await guild.channels.fetch();
    for (const [_, channel] of channels) {
      if (channel.isTextBased() && channel.permissionsFor(guild.roles.everyone)?.has('SendMessages')) {
        await channel.permissionOverwrites.edit(guild.roles.everyone, { SendMessages: false }).catch(() => {});
      }
    }

    return true;
  },
  async disableLockdown(guild, redisClient) {
    const key = `lockdown:${guild.id}`;
    await redisClient.del(key);

    const channels = await guild.channels.fetch();
    for (const [_, channel] of channels) {
      if (channel.isTextBased()) {
        await channel.permissionOverwrites.edit(guild.roles.everyone, { SendMessages: null }).catch(() => {});
      }
    }

    return true;
  },
};