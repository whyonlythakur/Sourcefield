module.exports = {
  name: 'duplicate',
  enabled: false,
  threshold: 3,
  ladder: ['warn', 'mute', 'kick', 'ban'],
  async check(message, redisClient) {
    return { triggered: false, confidence: 0, evidence: null };
  },
};
