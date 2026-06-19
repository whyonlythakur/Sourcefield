module.exports = {
  name: 'massEmoji',
  enabled: false,
  threshold: 10,
  ladder: ['warn', 'mute', 'kick', 'ban'],
  async check(message, redisClient) {
    return { triggered: false, confidence: 0, evidence: null };
  },
};
