module.exports = {
  name: 'spam',
  enabled: true,
  threshold: 5,
  ladder: ['warn', 'mute', 'kick', 'ban'],
  async check(message, redisClient) {
    const key = `spam:${message.guild.id}:${message.author.id}`;
    const windowMs = 5000;
    const maxMessages = message.guild.modules?.spam?.threshold || 5;

    const now = Date.now();
    const messages = await redisClient.zrangebyscore(key, now - windowMs, now);

    await redisClient.zadd(key, now, `${now}-${Math.random()}`);
    await redisClient.expire(key, Math.ceil(windowMs / 1000));

    if (messages.length >= maxMessages) {
      return {
        triggered: true,
        confidence: Math.min(80 + (messages.length - maxMessages) * 5, 100),
        evidence: { messageCount: messages.length + 1, windowMs },
        severity: messages.length >= maxMessages * 2 ? 'high' : 'medium',
      };
    }

    return { triggered: false, confidence: 0, evidence: null };
  },
};