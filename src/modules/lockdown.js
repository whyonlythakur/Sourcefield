module.exports = {
  name: 'lockdown',
  enabled: false,
  threshold: 0,
  ladder: ['warn', 'mute', 'kick', 'ban'],
  async check(message, redisClient) {
    return { triggered: false, confidence: 0, evidence: null };
  },
};
