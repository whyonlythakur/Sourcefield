module.exports = {
  name: 'capsLock',
  enabled: false,
  threshold: 70,
  ladder: ['warn', 'mute', 'kick', 'ban'],
  async check(message, redisClient) {
    const content = message.content;
    if (!content || content.length < 5) {
      return { triggered: false, confidence: 0, evidence: null };
    }

    const letters = content.replace(/[^a-zA-Z]/g, '');
    if (letters.length < 3) {
      return { triggered: false, confidence: 0, evidence: null };
    }

    const uppercase = letters.replace(/[^A-Z]/g, '').length;
    const percentage = (uppercase / letters.length) * 100;

    const threshold = message.guild.modules?.capsLock?.threshold || 70;

    if (percentage >= threshold) {
      return {
        triggered: true,
        confidence: Math.min(60 + (percentage - threshold), 100),
        evidence: {
          percentage: Math.round(percentage),
          uppercase,
          totalLetters: letters.length,
          threshold,
        },
        severity: percentage >= 90 ? 'medium' : 'low',
      };
    }

    return { triggered: false, confidence: 0, evidence: null };
  },
};