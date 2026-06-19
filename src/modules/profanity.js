const PROFANITY_PATTERNS = [
  /\b(fuck|fuk|fk|f\*k|f\*\*)\b/gi,
  /\b(shit|sh\*t|sh1t)\b/gi,
  /\b(bitch|b1tch|b\*tch)\b/gi,
  /\b(asshole|ass\*\*|a\*\*)\b/gi,
  /\b(damn|damn it|god damn)\b/gi,
  /\b(hell)\b/gi,
  /\b(crap|crappy)\b/gi,
  /\b(piss|pissed off)\b/gi,
];

const SEVERE_PATTERNS = [
  /\b(nigger|nigga|n\*\*a)\b/gi,
  /\b(slur)\b/gi,
];

module.exports = {
  name: 'profanity',
  enabled: true,
  threshold: 3,
  ladder: ['warn', 'mute', 'kick', 'ban'],
  async check(message, redisClient) {
    const content = message.content.toLowerCase();
    if (!content) return { triggered: false, confidence: 0, evidence: null };

    let matchCount = 0;
    let severeCount = 0;
    const matchedWords = [];

    for (const pattern of PROFANITY_PATTERNS) {
      const matches = content.match(pattern);
      if (matches) {
        matchCount += matches.length;
        matchedWords.push(...matches.map(m => `"${m}"`));
      }
    }

    for (const pattern of SEVERE_PATTERNS) {
      const matches = content.match(pattern);
      if (matches) {
        severeCount += matches.length;
        matchedWords.push(...matches.map(m => `"${m}"`));
      }
    }

    const totalMatches = matchCount + (severeCount * 3);
    const threshold = message.guild.modules?.profanity?.threshold || 3;

    if (totalMatches >= 1 || severeCount >= 1) {
      const confidence = Math.min(60 + (totalMatches * 15) + (severeCount * 20), 100);
      const severity = severeCount >= 1 || totalMatches >= 3 ? 'high' : 'medium';

      return {
        triggered: true,
        confidence,
        evidence: {
          matchCount: totalMatches,
          severeCount,
          matchedWords: matchedWords.slice(0, 5).join(', '),
        },
        severity,
      };
    }

    return { triggered: false, confidence: 0, evidence: null };
  },
};