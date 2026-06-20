module.exports = {
  name: 'autoSlowmode',
  enabled: false,
  threshold: 10,
  ladder: ['warn', 'mute', 'kick', 'ban'],
  async check(message, redisClient) {
    const key = `slowmode:${message.guild.id}:${message.channel.id}`;
    const windowMs = 10000;
    const threshold = message.guild.modules?.autoSlowmode?.threshold || 10;

    const now = Date.now();
    const recentMessages = await redisClient.zrangebyscore(key, now - windowMs, now);

    await redisClient.zadd(key, now, `${message.id}-${now}`);
    await redisClient.expire(key, Math.ceil(windowMs / 1000));

    if (recentMessages.length >= threshold) {
      const channel = message.channel;
      if (channel.rateLimitPerUser < 5) {
        await channel.setRateLimitPerUser(5, 'AutoMod: High message velocity detected').catch(() => {});
        return {
          triggered: true,
          confidence: 85,
          evidence: {
            messageCount: recentMessages.length,
            threshold,
            windowMs,
            slowmodeEnabled: 5,
          },
          severity: 'low',
        };
      }
    }

    return { triggered: false, confidence: 0, evidence: null };
  },
};