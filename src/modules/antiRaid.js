module.exports = {
  name: 'antiRaid',
  enabled: true,
  threshold: 5,
  ladder: ['warn', 'mute', 'kick', 'ban'],
  async check(message, redisClient) {
    const key = `raid:${message.guild.id}`;
    const windowMs = 60000;
    const maxJoins = message.guild.modules?.antiRaid?.threshold || 5;

    const now = Date.now();
    const recentJoins = await redisClient.zrangebyscore(key, now - windowMs, now);

    if (recentJoins.length >= maxJoins) {
      return {
        triggered: true,
        confidence: Math.min(75 + (recentJoins.length - maxJoins) * 5, 100),
        evidence: {
          joinCount: recentJoins.length,
          windowMs,
          threshold: maxJoins,
        },
        severity: recentJoins.length >= maxJoins * 2 ? 'critical' : 'high',
      };
    }

    return { triggered: false, confidence: 0, evidence: null };
  },
};