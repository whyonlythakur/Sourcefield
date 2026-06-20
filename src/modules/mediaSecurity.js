module.exports = {
  name: 'mediaSecurity',
  enabled: false,
  threshold: 0,
  ladder: ['warn', 'mute', 'kick', 'ban'],
  async check(message, redisClient) {
    if (message.attachments.size === 0) {
      return { triggered: false, confidence: 0, evidence: null };
    }

    const guildDoc = await message.client.db.Guild.findOne({ guildId: message.guild.id });
    const security = guildDoc?.security || {};
    const mediaChannelId = security.mediaChannelId;
    const trustedRoleId = security.trustedRoleId;
    const level = security.level || 'low';

    const member = message.member;
    const isTrusted = trustedRoleId && member?.roles.cache.has(trustedRoleId);
    if (isTrusted) {
      return { triggered: false, confidence: 0, evidence: null };
    }

    const isMediaChannel = message.channel.id === mediaChannelId;
    if (!isMediaChannel) {
      return {
        triggered: true,
        confidence: 100,
        evidence: {
          reason: 'Media posted in non-media channel',
          currentChannel: message.channel.id,
          mediaChannel: mediaChannelId,
          securityLevel: level,
        },
        severity: 'medium',
      };
    }

    const maxAttachments = level === 'low' ? 2 : level === 'moderate' ? 1 : 0;
    if (message.attachments.size > maxAttachments) {
      return {
        triggered: true,
        confidence: 100,
        evidence: {
          reason: 'Exceeded attachment limit',
          attachmentCount: message.attachments.size,
          maxAllowed: maxAttachments,
          securityLevel: level,
        },
        severity: 'medium',
      };
    }

    if (level === 'high' && message.attachments.size > 0) {
      return {
        triggered: true,
        confidence: 100,
        evidence: {
          reason: 'High security - media review required',
          attachmentCount: message.attachments.size,
          securityLevel: level,
          requiresReview: true,
        },
        severity: 'high',
      };
    }

    return { triggered: false, confidence: 0, evidence: null };
  },
};