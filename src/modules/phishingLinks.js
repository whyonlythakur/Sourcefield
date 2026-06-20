const KNOWN_PHISHING_DOMAINS = [
  'discordgift',
  'discorcl',
  'dlscord',
  'dliscord',
  'discordo',
  'discordapp',
  'steamcommunnity',
  'steamcomminuty',
  'vapor.store',
  'nitro-discord',
  'free-nitro',
  'discord-nitro',
];

const URL_REGEX = /https?:\/\/(?:www\.)?([a-zA-Z0-9-]+\.[a-zA-Z]{2,})(?:\/[^\s]*)?/gi;

module.exports = {
  name: 'phishingLinks',
  enabled: false,
  threshold: 1,
  ladder: ['warn', 'mute', 'kick', 'ban'],
  async check(message, redisClient) {
    const content = message.content;
    if (!content) return { triggered: false, confidence: 0, evidence: null };

    const urls = content.match(URL_REGEX);
    if (!urls || urls.length === 0) {
      return { triggered: false, confidence: 0, evidence: null };
    }

    const suspiciousUrls = [];
    for (const url of urls) {
      const domain = url.match(URL_REGEX)?.[1]?.toLowerCase();
      if (!domain) continue;

      const isPhishing = KNOWN_PHISHING_DOMAINS.some(phish => domain.includes(phish));
      const isSuspiciousTLD = domain.endsWith('.xyz') || domain.endsWith('.top') || domain.endsWith('.tk') || domain.endsWith('.ml');

      if (isPhishing || isSuspiciousTLD) {
        suspiciousUrls.push({ url, domain, reason: isPhishing ? 'known_phishing' : 'suspicious_tld' });
      }
    }

    if (suspiciousUrls.length > 0) {
      return {
        triggered: true,
        confidence: suspiciousUrls.some(u => u.reason === 'known_phishing') ? 95 : 70,
        evidence: {
          urlCount: urls.length,
          suspiciousCount: suspiciousUrls.length,
          urls: suspiciousUrls.map(u => u.url),
        },
        severity: 'critical',
      };
    }

    return { triggered: false, confidence: 0, evidence: null };
  },
};