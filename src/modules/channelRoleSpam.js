module.exports = {
  name: 'channelRoleSpam',
  enabled: false,
  threshold: 5,
  ladder: ['warn', 'mute', 'kick', 'ban'],
  async check(message, redisClient) {
    const key = `channelRoleSpam:${message.guild.id}`;
    const windowMs = 60000;
    const threshold = message.guild.modules?.channelRoleSpam?.threshold || 5;

    const now = Date.now();
    const recentEvents = await redisClient.get(key);
    const count = recentEvents ? parseInt(recentEvents, 10) : 0;

    if (count >= threshold) {
      return {
        triggered: true,
        confidence: Math.min(70 + (count - threshold) * 10, 100),
        evidence: {
          eventCount: count,
          threshold,
          windowMs,
        },
        severity: count >= threshold * 2 ? 'critical' : 'high',
      };
    }

    return { triggered: false, confidence: 0, evidence: null };
  },
};