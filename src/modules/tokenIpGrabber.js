module.exports = {
  name: 'tokenIpGrabber',
  enabled: false,
  threshold: 1,
  ladder: ['warn', 'mute', 'kick', 'ban'],
  async check(message, redisClient) {
    return { triggered: false, confidence: 0, evidence: null };
  },
};
