module.exports = {
  name: 'selfbotDetection',
  enabled: false,
  threshold: 50,
  ladder: ['warn', 'mute', 'kick', 'ban'],
  async check(message, redisClient) {
    const userId = message.author.id;
    const key = `selfbot:${message.guild.id}:${userId}`;
    const windowMs = 60000;

    const now = Date.now();
    const recentMessages = await redisClient.zrangebyscore(key, now - windowMs, now);

    await redisClient.zadd(key, now, `${message.id}-${now}`);
    await redisClient.expire(key, Math.ceil(windowMs / 1000));

    const messageCount = recentMessages.length + 1;
    const avgInterval = messageCount > 1 ? windowMs / (messageCount - 1) : Infinity;

    const hasUnusualPattern = message.content.length < 5 && messageCount > 10;
    const isRapidFire = avgInterval < 1000;
    const threshold = message.guild.modules?.selfbotDetection?.threshold || 50;

    if (messageCount >= threshold || isRapidFire || hasUnusualPattern) {
      const confidence = Math.min(60 + (messageCount - threshold) * 2 + (isRapidFire ? 20 : 0) + (hasUnusualPattern ? 10 : 0), 100);

      return {
        triggered: true,
        confidence,
        evidence: {
          messageCount,
          threshold,
          avgIntervalMs: Math.round(avgInterval),
          isRapidFire,
          hasUnusualPattern,
        },
        severity: confidence >= 90 ? 'high' : 'medium',
      };
    }

    return { triggered: false, confidence: 0, evidence: null };
  },
};