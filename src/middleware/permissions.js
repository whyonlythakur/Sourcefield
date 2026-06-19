const config = require('../config');

const TIERS = {
  BOT_OWNER: 4,
  SERVER_OWNER: 3,
  BOT_ADMIN: 2,
  BOT_MODERATOR: 1,
  REPORTER: 0,
};

function getTier(member, guildDoc) {
  if (config.botOwnerIds.includes(member.id)) return TIERS.BOT_OWNER;
  if (member.guild.ownerId === member.id) return TIERS.SERVER_OWNER;

  const staffEntry = guildDoc?.staff?.find(s => s.userId === member.id);
  if (staffEntry) {
    if (staffEntry.role === 'admin') return TIERS.BOT_ADMIN;
    if (staffEntry.role === 'moderator') return TIERS.BOT_MODERATOR;
    if (staffEntry.role === 'reporter') return TIERS.REPORTER;
  }

  return -1;
}

function hasPermission(member, guildDoc, requiredTier) {
  return getTier(member, guildDoc) >= requiredTier;
}

module.exports = { TIERS, getTier, hasPermission };
