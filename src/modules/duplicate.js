module.exports = {
  name: 'duplicate',
  enabled: false,
  threshold: 3,
  ladder: ['warn', 'mute', 'kick', 'ban'],
  async check(message, redisClient) {
    if (!message.content || message.content.length < 10) {
      return { triggered: false, confidence: 0, evidence: null };
    }

    const key = `duplicate:${message.guild.id}:${message.author.id}`;
    const recentMessages = await redisClient.lrange(key, 0, 9);
    const normalizedContent = message.content.toLowerCase().trim();

    let duplicateCount = 0;
    for (const prevMsg of recentMessages) {
      if (prevMsg === normalizedContent) {
        duplicateCount++;
      }
    }

    await redisClient.lpush(key, normalizedContent);
    await redisClient.ltrim(key, 0, 9);
    await redisClient.expire(key, 300);

    const threshold = message.guild.modules?.duplicate?.threshold || 3;

    if (duplicateCount >= threshold) {
      return {
        triggered: true,
        confidence: Math.min(60 + (duplicateCount - threshold) * 15, 100),
        evidence: {
          duplicateCount,
          threshold,
          content: message.content.substring(0, 100),
        },
        severity: duplicateCount >= threshold * 2 ? 'high' : 'medium',
      };
    }

    return { triggered: false, confidence: 0, evidence: null };
  },
};