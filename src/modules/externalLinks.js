const URL_REGEX = /https?:\/\/(?:www\.)?([a-zA-Z0-9-]+\.[a-zA-Z]{2,})(?:\/[^\s]*)?/gi;

module.exports = {
  name: 'externalLinks',
  enabled: true,
  threshold: 1,
  ladder: ['warn', 'mute', 'kick', 'ban'],
  async check(message, redisClient) {
    const content = message.content;
    if (!content) return { triggered: false, confidence: 0, evidence: null };

    const urls = content.match(URL_REGEX);
    if (!urls || urls.length === 0) {
      return { triggered: false, confidence: 0, evidence: null };
    }

    const guildDoc = await message.client.db.Guild.findOne({ guildId: message.guild.id });
    const allowedDomains = guildDoc?.modules?.externalLinks?.allowedDomains || [];
    const blockedDomains = guildDoc?.modules?.externalLinks?.blockedDomains || [];

    const violations = [];
    for (const url of urls) {
      const domain = url.match(URL_REGEX)?.[1]?.toLowerCase();
      if (!domain) continue;

      if (blockedDomains.includes(domain)) {
        violations.push({ url, reason: 'blocked', domain });
      } else if (allowedDomains.length > 0 && !allowedDomains.includes(domain)) {
        violations.push({ url, reason: 'not_allowed', domain });
      }
    }

    if (violations.length > 0) {
      return {
        triggered: true,
        confidence: 90,
        evidence: {
          urlCount: urls.length,
          violations: violations.map(v => v.url),
          blockedCount: violations.filter(v => v.reason === 'blocked').length,
        },
        severity: violations.some(v => v.reason === 'blocked') ? 'high' : 'medium',
      };
    }

    return { triggered: false, confidence: 0, evidence: null };
  },
};