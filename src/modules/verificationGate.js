module.exports = {
  name: 'verificationGate',
  enabled: false,
  threshold: 0,
  ladder: ['warn', 'mute', 'kick', 'ban'],
  async check(message, redisClient) {
    const guildDoc = await message.client.db.Guild.findOne({ guildId: message.guild.id });
    if (!guildDoc?.verification?.enabled) {
      return { triggered: false, confidence: 0, evidence: null };
    }

    const gateRoleId = guildDoc.verification.gateRoleId;
    if (!gateRoleId) return { triggered: false, confidence: 0, evidence: null };

    const member = message.member;
    if (!member) return { triggered: false, confidence: 0, evidence: null };

    const hasGateRole = member.roles.cache.has(gateRoleId);
    if (hasGateRole) {
      return { triggered: false, confidence: 0, evidence: null };
    }

    return {
      triggered: true,
      confidence: 100,
      evidence: {
        reason: 'User has not completed verification',
        gateRoleId,
        unverified: true,
      },
      severity: 'high',
    };
  },
};