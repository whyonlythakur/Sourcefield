const GRABBER_KEYWORDS = [
  'token',
  'ip grabber',
  'iplogger',
  'grab.link',
  'blooket.com',
  'grabify',
  'ps3cfw',
  'blasphemous',
  'discord.token',
  'navigator.userAgent',
  'window.location',
  'document.cookie',
];

const URL_REGEX = /https?:\/\/(?:www\.)?([a-zA-Z0-9-]+\.[a-zA-Z]{2,})(?:\/[^\s]*)?/gi;
const SHORTENER_DOMAINS = ['grab.link', 'iplogger.org', 'iplogger.com', '2no.co', '0x00.nu'];

module.exports = {
  name: 'tokenIpGrabber',
  enabled: false,
  threshold: 1,
  ladder: ['warn', 'mute', 'kick', 'ban'],
  async check(message, redisClient) {
    const content = message.content.toLowerCase();
    if (!content) return { triggered: false, confidence: 0, evidence: null };

    const hasGrabberKeywords = GRABBER_KEYWORDS.some(keyword => content.includes(keyword));
    const urls = content.match(URL_REGEX) || [];

    const isShortener = urls.some(url => {
      const domain = url.match(URL_REGEX)?.[1]?.toLowerCase();
      return SHORTENER_DOMAINS.some(s => domain?.includes(s));
    });

    if (hasGrabberKeywords || isShortener) {
      return {
        triggered: true,
        confidence: hasGrabberKeywords && isShortener ? 98 : hasGrabberKeywords || isShortener ? 85 : 50,
        evidence: {
          hasKeywords: hasGrabberKeywords,
          hasShortener: isShortener,
          urls,
          keywords: GRABBER_KEYWORDS.filter(k => content.includes(k)),
        },
        severity: 'critical',
      };
    }

    return { triggered: false, confidence: 0, evidence: null };
  },
};