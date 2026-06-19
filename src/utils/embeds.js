const { EmbedBuilder } = require('discord.js');

const COLORS = {
  info: 0x5865F2,
  warning: 0xF0B232,
  danger: 0xED4245,
  success: 0x23A55A,
  raid: 0x9B59B6,
};

function buildLogEmbed(category, data) {
  const color = COLORS[data.color] || COLORS.info;
  const embed = new EmbedBuilder()
    .setColor(color)
    .setTitle(data.title || category)
    .setTimestamp();

  if (data.description) embed.setDescription(data.description);
  if (data.fields) embed.addFields(data.fields);
  if (data.footer) embed.setFooter({ text: data.footer });

  return embed;
}

function buildCaseEmbed(caseDoc) {
  const color = caseDoc.status === 'resolved' ? COLORS.success : COLORS.warning;
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

module.exports = { COLORS, buildLogEmbed, buildCaseEmbed };
