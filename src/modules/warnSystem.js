module.exports = {
  name: 'warnSystem',
  enabled: true,
  threshold: 3,
  ladder: ['warn', 'mute', 'kick', 'ban'],
  async check(message, redisClient) {
    const User = require('../models/User');
    const userDoc = await User.findOne({ userId: message.author.id, guildId: message.guild.id });

    if (!userDoc || userDoc.warnPoints < this.threshold) {
      return { triggered: false, confidence: 0, evidence: null };
    }

    const points = userDoc.warnPoints;
    let suggestedAction = 'warn';
    if (points >= 7) suggestedAction = 'ban';
    else if (points >= 5) suggestedAction = 'kick';
    else if (points >= 3) suggestedAction = 'mute';

    return {
      triggered: true,
      confidence: Math.min(50 + (points - this.threshold) * 10, 100),
      evidence: {
        warnPoints: points,
        threshold: this.threshold,
        suggestedAction,
      },
      severity: points >= 7 ? 'critical' : points >= 5 ? 'high' : 'medium',
    };
  },
};