const NSFW_KEYWORDS = [
  'porn', 'xxx', 'sex', 'nude', 'naked', 'nsfw', 'onlyfans', 'hotgirl', 'sexy',
  'pussy', 'dick', 'cock', 'cum', 'assfuck', 'blowjob', 'milf', 'teenporn',
];

module.exports = {
  name: 'nsfwImage',
  enabled: false,
  threshold: 80,
  ladder: ['warn', 'mute', 'kick', 'ban'],
  async check(message, redisClient) {
    if (message.attachments.size === 0) {
      return { triggered: false, confidence: 0, evidence: null };
    }

    const channel = message.channel;
    const isNSFWChannel = channel.nsfw;
    if (isNSFWChannel) {
      return { triggered: false, confidence: 0, evidence: null };
    }

    const images = message.attachments.filter(a => a.contentType?.startsWith('image/') || a.name.match(/\.(jpg|jpeg|png|gif|webp)$/i));
    if (images.size === 0) {
      return { triggered: false, confidence: 0, evidence: null };
    }

    const hasNsfwKeywords = NSFW_KEYWORDS.some(k => message.content.toLowerCase().includes(k) || images.some(img => img.name.toLowerCase().includes(k)));
    const suspiciousFilenames = images.filter(img => img.name.toLowerCase().match(/nsfw|porn|sex|nude|xxx/i)).size;

    if (hasNsfwKeywords || suspiciousFilenames > 0) {
      return {
        triggered: true,
        confidence: Math.min(70 + (suspiciousFilenames * 10) + (hasNsfwKeywords ? 20 : 0), 100),
        evidence: {
          imageCount: images.size,
          hasNsfwKeywords,
          suspiciousFilenames: suspiciousFilenames,
          inNonNsfwChannel: true,
        },
        severity: 'high',
      };
    }

    return { triggered: false, confidence: 0, evidence: null };
  },
};