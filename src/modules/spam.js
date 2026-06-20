// In-memory message tracking (resets on bot restart)
const messageCache = new Map();

module.exports = {
  name: 'spam',
  enabled: true,
  threshold: 5,
  ladder: ['warn', 'mute', 'kick', 'ban'],
  async check(message) {
    const key = `${message.guild.id}:${message.author.id}`;
    const now = Date.now();
    const windowMs = 5000;
    
    if (!messageCache.has(key)) {
      messageCache.set(key, []);
    }
    
    const messages = messageCache.get(key);
    const recentMessages = messages.filter(timestamp => now - timestamp < windowMs);
    
    recentMessages.push(now);
    messageCache.set(key, recentMessages);
    
    const maxMessages = message.guild.modules?.spam?.threshold || 5;
    
    if (recentMessages.length >= maxMessages) {
      return {
        triggered: true,
        confidence: Math.min(80 + (recentMessages.length - maxMessages) * 5, 100),
        evidence: { messageCount: recentMessages.length, windowMs },
        severity: recentMessages.length >= maxMessages * 2 ? 'high' : 'medium',
      };
    }
    
    return { triggered: false, confidence: 0, evidence: null };
  },
};