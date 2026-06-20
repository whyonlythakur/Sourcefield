const Guild = require('../models/Guild');
const User = require('../models/User');
const Case = require('../models/Case');
const { sendLog } = require('./logHandler');
const { buildModActionEmbed } = require('../utils/embeds');

const PUNISHMENT_WEIGHTS = {
  warn: 1,
  mute: 2,
  kick: 3,
  ban: 4,
};

async function executePunishment(client, guildId, userId, punishment, reason, caseDoc = null) {
  const guild = await client.guilds.fetch(guildId).catch(() => null);
  if (!guild) {
    console.error(`[ActionHandler] Guild ${guildId} not found`);
    return null;
  }

  const member = await guild.members.fetch(userId).catch(() => null);
  if (!member && punishment !== 'ban') {
    console.error(`[ActionHandler] Member ${userId} not found in guild ${guildId}`);
    return null;
  }

  const user = await client.users.fetch(userId).catch(() => null);
  if (!user) {
    console.error(`[ActionHandler] User ${userId} not found`);
    return null;
  }

  let userDoc = await User.findOne({ userId, guildId });
  if (!userDoc) {
    userDoc = await User.create({ userId, guildId, warnPoints: 0 });
  }

  if (caseDoc) {
    userDoc.history.push(caseDoc._id);
    await userDoc.save();
  }

  switch (punishment) {
    case 'warn':
      userDoc.warnPoints += 1;
      await userDoc.save();
      await checkAutoEscalation(client, guild, user, userDoc, reason);
      break;

    case 'mute':
      if (member) {
        const duration = 60 * 60 * 1000;
        await member.timeout(duration, reason || 'Automod punishment');
        userDoc.warnPoints += 2;
        await userDoc.save();
      }
      break;

    case 'kick':
      if (member && member.kickable) {
        await member.kick(reason || 'Automod punishment');
        userDoc.warnPoints += 3;
        await userDoc.save();
      }
      break;

    case 'ban':
      if (member && member.bannable) {
        await member.ban({ reason: reason || 'Automod punishment', deleteMessageSeconds: 7 * 86400 });
        userDoc.warnPoints += 4;
        await userDoc.save();
      }
      break;

    default:
      console.warn(`[ActionHandler] Unknown punishment: ${punishment}`);
      return null;
  }

  await sendLog(client, guildId, 'modActions', {
    title: `${punishment.toUpperCase()} - ${user.username}`,
    description: reason || 'No reason provided',
    fields: [
      { name: 'Target', value: `<@${userId}>`, inline: true },
      { name: 'Warn Points', value: `${userDoc.warnPoints}`, inline: true },
    ],
  });

  try {
    await user.send(`You received a **${punishment}** in **${guild.name}**\n\n**Reason:** ${reason || 'No reason provided'}\n\nYou now have **${userDoc.warnPoints}** warn points.`);
  } catch (err) {}

  return { user, userDoc, punishment };
}

async function checkAutoEscalation(client, guild, user, userDoc, reason) {
  const thresholds = {
    mute: 3,
    kick: 5,
    ban: 7,
  };

  if (userDoc.warnPoints >= thresholds.ban) {
    await executePunishment(client, guild.id, user.id, 'ban', `Auto-ban: ${userDoc.warnPoints} warn points reached. Last reason: ${reason}`);
    await sendLog(client, guild.id, 'automodTriggers', {
      title: 'Auto-Escalation: BAN',
      description: `<@${user.id}> reached ${userDoc.warnPoints} warn points`,
      color: 'danger',
    });
  } else if (userDoc.warnPoints >= thresholds.kick) {
    await executePunishment(client, guild.id, user.id, 'kick', `Auto-kick: ${userDoc.warnPoints} warn points reached. Last reason: ${reason}`);
    await sendLog(client, guild.id, 'automodTriggers', {
      title: 'Auto-Escalation: KICK',
      description: `<@${user.id}> reached ${userDoc.warnPoints} warn points`,
      color: 'warning',
    });
  } else if (userDoc.warnPoints >= thresholds.mute) {
    await executePunishment(client, guild.id, user.id, 'mute', `Auto-mute: ${userDoc.warnPoints} warn points reached. Last reason: ${reason}`);
    await sendLog(client, guild.id, 'automodTriggers', {
      title: 'Auto-Escalation: MUTE',
      description: `<@${user.id}> reached ${userDoc.warnPoints} warn points`,
      color: 'warning',
    });
  }
}

async function handleModuleTrigger(client, message, moduleName, result) {
  const guildDoc = await Guild.findOne({ guildId: message.guild.id });
  if (!guildDoc) return;

  const moduleConfig = guildDoc.modules[moduleName];
  if (!moduleConfig || !moduleConfig.enabled) return;

  const ladder = moduleConfig.ladder || ['warn', 'mute', 'kick', 'ban'];
  const userDoc = await User.findOne({ userId: message.author.id, guildId: message.guild.id });
  const currentPoints = userDoc?.warnPoints || 0;

  let punishment = 'warn';
  if (currentPoints >= 7) punishment = 'ban';
  else if (currentPoints >= 5) punishment = 'kick';
  else if (currentPoints >= 3) punishment = 'mute';

  const caseDoc = await Case.create({
    caseId: require('../utils/caseId').generateCaseId(),
    guildId: message.guild.id,
    type: 'auto',
    module: moduleName,
    severity: result.severity || 'medium',
    targetUserId: message.author.id,
    evidence: {
      content: message.content,
      attachments: message.attachments.map(a => a.url),
      confidenceScore: result.confidence,
    },
    status: 'resolved',
    punishment,
    resolvedAt: new Date(),
  });

  await executePunishment(client, message.guild.id, message.author.id, punishment, `[AutoMod] ${moduleName}: ${result.evidence?.matchedWords || 'Violation detected'}`, caseDoc);

  try {
    await message.delete();
  } catch (err) {}
}

module.exports = { executePunishment, checkAutoEscalation, handleModuleTrigger, PUNISHMENT_WEIGHTS };