module.exports = {
  name: 'newAccount',
  enabled: false,
  threshold: 7,
  ladder: ['warn', 'mute', 'kick', 'ban'],
  async check(message, redisClient) {
    const member = message.member;
    if (!member) return { triggered: false, confidence: 0, evidence: null };

    const accountAgeMs = Date.now() - member.user.createdTimestamp;
    const accountAgeDays = Math.floor(accountAgeMs / 86400000);
    const threshold = message.guild.modules?.newAccount?.threshold || 7;

    if (accountAgeDays < threshold) {
      return {
        triggered: true,
        confidence: Math.min(80 + (threshold - accountAgeDays) * 5, 100),
        evidence: {
          accountAgeDays,
          threshold,
          createdAt: member.user.createdAt.toISOString(),
        },
        severity: accountAgeDays < 3 ? 'high' : 'medium',
      };
    }

    return { triggered: false, confidence: 0, evidence: null };
  },
};