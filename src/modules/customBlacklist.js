module.exports = {
  name: 'customBlacklist',
  enabled: false,
  threshold: 1,
  ladder: ['warn', 'mute', 'kick', 'ban'],
  async check(message, redisClient) {
    const content = message.content.toLowerCase();
    if (!content) return { triggered: false, confidence: 0, evidence: null };

    const guildDoc = await message.client.db.Guild.findOne({ guildId: message.guild.id });
    const blacklist = guildDoc?.modules?.customBlacklist?.patterns || [];

    if (blacklist.length === 0) {
      return { triggered: false, confidence: 0, evidence: null };
    }

    const matchedPatterns = [];
    for (const pattern of blacklist) {
      try {
        const regex = new RegExp(pattern, 'gi');
        const matches = content.match(regex);
        if (matches && matches.length > 0) {
          matchedPatterns.push({ pattern, matches: matches.slice(0, 3) });
        }
      } catch (err) {
        console.error(`[CustomBlacklist] Invalid regex: ${pattern}`);
      }
    }

    if (matchedPatterns.length > 0) {
      return {
        triggered: true,
        confidence: 95,
        evidence: {
          matchedCount: matchedPatterns.length,
          patterns: matchedPatterns.map(m => m.pattern).join(', '),
          matchedWords: matchedPatterns.flatMap(m => m.matches).join(', '),
        },
        severity: 'high',
      };
    }

    return { triggered: false, confidence: 0, evidence: null };
  },
};