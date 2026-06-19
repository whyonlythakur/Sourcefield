module.exports = {
  name: 'capsLock',
  enabled: false,
  threshold: 70,
  ladder: ['warn', 'mute', 'kick', 'ban'],
  async check(message, redisClient) {
    return { triggered: false, confidence: 0, evidence: null };
  },
};
