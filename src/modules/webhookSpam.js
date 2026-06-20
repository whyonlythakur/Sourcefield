module.exports = {
  name: 'webhookSpam',
  enabled: false,
  threshold: 3,
  ladder: ['warn', 'mute', 'kick', 'ban'],
  async check(message, redisClient) {
    if (!message.webhook) return { triggered: false, confidence: 0, evidence: null };

    const key = `webhook:${message.guild.id}:${message.webhook.id}`;
    const windowMs = 60000;
    const threshold = message.guild.modules?.webhookSpam?.threshold || 3;

    const now = Date.now();
    const recentMessages = await redisClient.zrangebyscore(key, now - windowMs, now);

    await redisClient.zadd(key, now, `${message.id}-${now}`);
    await redisClient.expire(key, Math.ceil(windowMs / 1000));

    if (recentMessages.length >= threshold) {
      return {
        triggered: true,
        confidence: Math.min(75 + (recentMessages.length - threshold) * 10, 100),
        evidence: {
          webhookId: message.webhook.id,
          webhookName: message.webhook.name,
          messageCount: recentMessages.length + 1,
          threshold,
          windowMs,
        },
        severity: recentMessages.length >= threshold * 2 ? 'high' : 'medium',
      };
    }

    return { triggered: false, confidence: 0, evidence: null };
  },
};