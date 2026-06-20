const OFFENSIVE_PATTERNS = [
  /\b(nigger|nigga|n\*\*a)\b/gi,
  /\b(fag|faggot|f\*g)\b/gi,
  /\b(cunt|c\*nt)\b/gi,
  /\b(retard|retarded|r\*tard)\b/gi,
  /\b(tranny|tr\*nny)\b/gi,
];

const IMPERSONATION_PATTERNS = [
  /^discord (staff|admin|support|moderator|mod)$/i,
  /^discordapp\.com/i,
  /staff|admin|moderator|support|official/i,
];

module.exports = {
  name: 'nicknameFilter',
  enabled: false,
  threshold: 1,
  ladder: ['warn', 'mute', 'kick', 'ban'],
  async check(message, redisClient) {
    const member = message.member;
    if (!member || !member.nickname) {
      return { triggered: false, confidence: 0, evidence: null };
    }

    const nickname = member.nickname;
    const violations = [];

    for (const pattern of OFFENSIVE_PATTERNS) {
      if (pattern.test(nickname)) {
        violations.push({ type: 'offensive', pattern: pattern.toString() });
      }
    }

    for (const pattern of IMPERSONATION_PATTERNS) {
      if (pattern.test(nickname)) {
        violations.push({ type: 'impersonation', pattern: pattern.toString() });
      }
    }

    if (violations.length > 0) {
      return {
        triggered: true,
        confidence: 95,
        evidence: {
          nickname,
          violationCount: violations.length,
          violations: violations.map(v => v.type).join(', '),
        },
        severity: violations.some(v => v.type === 'impersonation') ? 'high' : 'medium',
      };
    }

    return { triggered: false, confidence: 0, evidence: null };
  },
};