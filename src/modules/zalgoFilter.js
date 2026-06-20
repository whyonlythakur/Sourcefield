// Zalgo/Unicode combining characters detection
// This regex detects combining diacritical marks that create "zalgo" text

module.exports = {
  name: 'zalgoFilter',
  enabled: false,
  threshold: 5,
  ladder: ['warn', 'mute', 'kick', 'ban'],
  async check(message, redisClient) {
    const content = message.content;
    if (!content || content.length < 10) {
      return { triggered: false, confidence: 0, evidence: null };
    }

    // Count combining diacritical marks (simplified approach)
    const combiningMarks = content.match(/[\u0300-\u036F]/g) || [];
    const count = combiningMarks.length;
    const ratio = count / content.length;

    const threshold = message.guild.modules?.zalgoFilter?.threshold || 5;

    if (count >= threshold || ratio > 0.3) {
      return {
        triggered: true,
        confidence: Math.min(70 + (count - threshold) * 5 + (ratio * 20), 100),
        evidence: {
          combiningMarks: count,
          ratio: Math.round(ratio * 100),
          threshold,
        },
        severity: ratio > 0.5 ? 'high' : 'medium',
      };
    }

    return { triggered: false, confidence: 0, evidence: null };
  },
};