module.exports = {
  name: 'zalgoFilter',
  enabled: false,
  threshold: 5,
  ladder: ['warn', 'mute', 'kick', 'ban'],
  async check(message, redisClient) {
    return { triggered: false, confidence: 0, evidence: null };
  },
};
