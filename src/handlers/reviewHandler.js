const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const Case = require('../models/Case');
const { buildCaseEmbed } = require('../utils/embeds');

async function createReviewEmbed(client, caseDoc) {
  const guild = await client.guilds.fetch(caseDoc.guildId).catch(() => null);
  if (!guild) return null;

  const targetUser = await client.users.fetch(caseDoc.targetUserId).catch(() => null);
  const reporter = caseDoc.reporterId ? await client.users.fetch(caseDoc.reporterId).catch(() => null) : null;

  const embed = new EmbedBuilder()
    .setColor(caseDoc.severity === 'critical' ? 0xED4245 : caseDoc.severity === 'high' ? 0xF0B232 : 0x5865F2)
    .setTitle(`Case ${caseDoc.caseId}`)
    .addFields(
      { name: 'Module', value: caseDoc.module || 'Manual Report', inline: true },
      { name: 'Severity', value: caseDoc.severity, inline: true },
      { name: 'Confidence', value: `${caseDoc.evidence.confidenceScore}%`, inline: true },
      { name: 'Target', value: targetUser ? `<@${targetUser.id}> (${targetUser.tag})` : caseDoc.targetUserId, inline: true },
      { name: 'Reporter', value: reporter ? `<@${reporter.id}>` : 'AutoDetected', inline: true },
      { name: 'Status', value: caseDoc.status, inline: true },
    )
    .setFooter({ text: `Case ID: ${caseDoc.caseId}` })
    .setTimestamp();

  if (caseDoc.evidence.content) {
    embed.addFields({ name: 'Evidence', value: caseDoc.evidence.content.substring(0, 1024) || 'No content', inline: false });
  }

  if (caseDoc.evidence.attachments?.length > 0) {
    embed.addFields({ name: 'Attachments', value: `${caseDoc.evidence.attachments.length} file(s)`, inline: false });
    embed.setThumbnail(caseDoc.evidence.attachments[0]);
  }

  return embed;
}

function createReviewButtons() {
  const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('review_approve')
        .setLabel('✅ Approve')
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId('review_reject')
        .setLabel('❌ Reject')
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId('review_escalate')
        .setLabel('⚠️ Escalate')
        .setStyle(ButtonStyle.Warning),
      new ButtonBuilder()
        .setCustomId('review_dismiss')
        .setLabel('Dismiss')
        .setStyle(ButtonStyle.Secondary),
    );

  return row;
}

async function sendReviewMessage(client, caseDoc, channelId) {
  const channel = client.channels.cache.get(channelId);
  if (!channel) return null;

  const embed = await createReviewEmbed(client, caseDoc);
  if (!embed) return null;

  const buttons = createReviewButtons();

  try {
    const message = await channel.send({
      embeds: [embed],
      components: [buttons],
    });
    return message;
  } catch (err) {
    console.error('[ReviewHandler] Failed to send review message:', err.message);
    return null;
  }
}

async function handleReviewInteraction(interaction, client) {
  if (!interaction.isButton()) return;

  const caseIdMatch = interaction.message.embeds[0]?.title?.match(/Case (AMP-\w+-\w+)/);
  if (!caseIdMatch) return;

  const caseId = caseIdMatch[1];
  const caseDoc = await Case.findOne({ caseId });
  if (!caseDoc) {
    return interaction.reply({ content: '❌ Case not found', ephemeral: true });
  }

  const action = interaction.customId;

  if (action === 'review_approve') {
    caseDoc.status = 'resolved';
    caseDoc.reviewerId = interaction.user.id;
    caseDoc.resolvedAt = new Date();
    await caseDoc.save();

    await interaction.update({
      content: `✅ Approved by <@${interaction.user.id}>`,
      embeds: [],
      components: [],
    });

    await interaction.followUp({
      content: `Case ${caseId} approved. Select punishment:`,
      components: [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder().setCustomId('punish_warn').setLabel('Warn').setStyle(ButtonStyle.Primary),
          new ButtonBuilder().setCustomId('punish_mute').setLabel('Mute').setStyle(ButtonStyle.Warning),
          new ButtonBuilder().setCustomId('punish_kick').setLabel('Kick').setStyle(ButtonStyle.Danger),
          new ButtonBuilder().setCustomId('punish_ban').setLabel('Ban').setStyle(ButtonStyle.Danger),
        ),
      ],
      ephemeral: true,
    });
  } else if (action === 'review_reject') {
    caseDoc.status = 'dismissed';
    caseDoc.reviewerId = interaction.user.id;
    caseDoc.resolvedAt = new Date();
    await caseDoc.save();

    await interaction.update({
      content: `❌ Rejected by <@${interaction.user.id}>`,
      embeds: [],
      components: [],
    });
  } else if (action === 'review_escalate') {
    caseDoc.status = 'escalated';
    await caseDoc.save();

    await interaction.reply({
      content: `⚠️ Case ${caseId} escalated to server owner`,
      ephemeral: true,
    });
  } else if (action === 'review_dismiss') {
    caseDoc.status = 'dismissed';
    caseDoc.reviewerId = interaction.user.id;
    caseDoc.resolvedAt = new Date();
    await caseDoc.save();

    await interaction.update({
      content: `Dismissed by <@${interaction.user.id}>`,
      embeds: [],
      components: [],
    });
  }
}

module.exports = {
  createReviewEmbed,
  createReviewButtons,
  sendReviewMessage,
  handleReviewInteraction,
};