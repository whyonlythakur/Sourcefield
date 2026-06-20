module.exports = {
  name: 'muteManager',
  enabled: true,
  threshold: 0,
  ladder: ['warn', 'mute', 'kick', 'ban'],
  async check(message, redisClient) {
    const member = message.member;
    if (!member || !member.isCommunicationDisabled()) {
      return { triggered: false, confidence: 0, evidence: null };
    }

    const muteEndTime = member.communicationDisabledUntilTimestamp;
    const now = Date.now();
    const remainingMs = muteEndTime - now;

    if (remainingMs > 0 && remainingMs < 300000) {
      return {
        triggered: true,
        confidence: 90,
        evidence: {
          isMuted: true,
          remainingMs,
          remainingMinutes: Math.floor(remainingMs / 60000),
        },
        severity: 'low',
      };
    }

    return { triggered: false, confidence: 0, evidence: null };
  },
};