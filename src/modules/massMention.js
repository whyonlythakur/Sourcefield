module.exports = {
  name: 'massMention',
  enabled: true,
  threshold: 5,
  ladder: ['warn', 'mute', 'kick', 'ban'],
  async check(message, redisClient) {
    if (!message.mentions) return { triggered: false, confidence: 0, evidence: null };

    const everyoneHere = (message.mentions.everyone ? 2 : 0);
    const userMentions = message.mentions.users?.size || 0;
    const totalMentions = everyoneHere + userMentions;

    const maxMentions = message.guild.modules?.massMention?.threshold || 5;

    if (totalMentions >= maxMentions) {
      const confidence = Math.min(70 + (totalMentions - maxMentions) * 10, 100);
      const severity = totalMentions >= maxMentions * 2 ? 'high' : 'medium';

      return {
        triggered: true,
        confidence,
        evidence: {
          mentionCount: totalMentions,
          everyoneHere,
          userMentions,
        },
        severity,
      };
    }

    return { triggered: false, confidence: 0, evidence: null };
  },
};