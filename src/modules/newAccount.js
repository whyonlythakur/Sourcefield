module.exports = {
  name: 'newAccount',
  enabled: false,
  threshold: 7,
  ladder: ['warn', 'mute', 'kick', 'ban'],
  async check(message, redisClient) {
    return { triggered: false, confidence: 0, evidence: null };
  },
};
