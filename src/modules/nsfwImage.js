module.exports = {
  name: 'nsfwImage',
  enabled: false,
  threshold: 80,
  ladder: ['warn', 'mute', 'kick', 'ban'],
  async check(message, redisClient) {
    return { triggered: false, confidence: 0, evidence: null };
  },
};
