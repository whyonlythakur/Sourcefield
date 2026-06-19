const { EmbedBuilder } = require('discord.js');

const COLORS = {
  modActions: 0x23A55A,
  automodTriggers: 0xF0B232,
  messageLogs: 0x5865F2,
  memberLogs: 0x5865F2,
  raidLogs: 0x9B59B6,
  caseLogs: 0xF0B232,
  serverLogs: 0x5865F2,
  errorLogs: 0xED4245,
};

const TITLES = {
  modActions: 'Moderation Action',
  automodTriggers: 'AutoMod Trigger',
  messageLogs: 'Message Event',
  memberLogs: 'Member Event',
  raidLogs: 'Raid Alert',
  caseLogs: 'Case Update',
  serverLogs: 'Server Event',
  errorLogs: 'Error',
};

function buildLogEmbed(category, data) {
  const color = data.color || COLORS[category] || 0x5865F2;
  const title = data.title || TITLES[category] || category;

  const embed = new EmbedBuilder()
    .setColor(color)
    .setTitle(title)
    .setTimestamp();

  if (data.description) embed.setDescription(data.description);
  if (data.fields) embed.addFields(data.fields);
  if (data.footer) embed.setFooter({ text: data.footer });
  if (data.thumbnail) embed.setThumbnail(data.thumbnail);
  if (data.author) embed.setAuthor(data.author);

  return embed;
}

function buildCaseEmbed(caseDoc) {
  const color = caseDoc.status === 'resolved' ? COLORS.modActions : COLORS.automodTriggers;
  const embed = new EmbedBuilder()
    .setColor(color)
    .setTitle(`Case ${caseDoc.caseId}`)
    .addFields(
      { name: 'Module', value: caseDoc.module || 'Manual', inline: true },
      { name: 'Severity', value: caseDoc.severity, inline: true },
      { name: 'Status', value: caseDoc.status, inline: true },
      { name: 'Target', value: `<@${caseDoc.targetUserId}>`, inline: true },
      { name: 'Confidence', value: `${caseDoc.evidence.confidenceScore}%`, inline: true },
    )
    .setFooter({ text: `Case ${caseDoc.caseId}` })
    .setTimestamp();

  if (caseDoc.evidence.content) {
    embed.addFields({ name: 'Evidence', value: caseDoc.evidence.content.substring(0, 1024), inline: false });
  }

  return embed;
}

function buildModActionEmbed(action, moderator, target, reason) {
  const embed = new EmbedBuilder()
    .setColor(COLORS.modActions)
    .setTitle(`${action.toUpperCase()} - ${target.username}`)
    .addFields(
      { name: 'Moderator', value: `<@${moderator.id}>`, inline: true },
      { name: 'Target', value: `<@${target.id}> (${target.tag})`, inline: true },
    )
    .setFooter({ text: `User ID: ${target.id}` })
    .setTimestamp();

  if (reason) embed.addFields({ name: 'Reason', value: reason, inline: false });

  return embed;
}

module.exports = { COLORS, TITLES, buildLogEmbed, buildCaseEmbed, buildModActionEmbed };