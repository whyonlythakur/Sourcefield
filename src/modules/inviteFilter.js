const INVITE_REGEX = /(?:https?:\/\/)?(?:www\.)?(?:discord\.gg|discord\.com\/invite|discordapp\.com\/invite)\/[a-zA-Z0-9_-]+/gi;

module.exports = {
  name: 'inviteFilter',
  enabled: true,
  threshold: 1,
  ladder: ['warn', 'mute', 'kick', 'ban'],
  async check(message, redisClient) {
    const content = message.content;
    if (!content) return { triggered: false, confidence: 0, evidence: null };

    const invites = content.match(INVITE_REGEX);
    if (!invites || invites.length === 0) {
      return { triggered: false, confidence: 0, evidence: null };
    }

    const guildDoc = await message.client.db.Guild.findOne({ guildId: message.guild.id });
    const whitelistedCodes = guildDoc?.modules?.inviteFilter?.whitelist || [];

    const unauthorizedInvites = invites.filter(invite => {
      const code = invite.split('/').pop();
      return !whitelistedCodes.includes(code);
    });

    if (unauthorizedInvites.length > 0) {
      return {
        triggered: true,
        confidence: 95,
        evidence: {
          inviteCount: unauthorizedInvites.length,
          invites: unauthorizedInvites,
        },
        severity: 'medium',
      };
    }

    return { triggered: false, confidence: 0, evidence: null };
  },
};