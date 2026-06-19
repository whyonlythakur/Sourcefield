module.exports = {
  name: 'selfbotDetection',
  enabled: false,
  threshold: 50,
  ladder: ['warn', 'mute', 'kick', 'ban'],
  async check(message, redisClient) {
    return { triggered: false, confidence: 0, evidence: null };
  },
};
