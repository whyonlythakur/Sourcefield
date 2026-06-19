const { SlashCommandBuilder } = require('discord.js');
const Guild = require('../../models/Guild');
const Case = require('../../models/Case');
const { generateCaseId } = require('../../utils/caseId');
const { TIERS, getTier } = require('../../middleware/permissions');
const { sendLog } = require('../../handlers/logHandler');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('flag')
    .setDescription('Staff: manually flag a message or user')
    .addStringOption(o => o.setName('message_link').setDescription('Discord message link').setRequired(false))
    .addStringOption(o => o.setName('reason').setDescription('Flag reason').setRequired(true)),
  async execute(interaction) {
    const guildDoc = await Guild.findOne({ guildId: interaction.guildId });
    if (getTier(interaction.member, guildDoc) < TIERS.BOT_MODERATOR) {
      return interaction.reply({ content: '❌ Only moderators can flag users/messages.', ephemeral: true });
    }

    const messageLink = interaction.options.getString('message_link');
    const reason = interaction.options.getString('reason', true);

    let targetUserId = null;
    let evidenceContent = reason;

    if (messageLink) {
      const match = messageLink.match(/\/channels\/(\d+)\/(\d+)\/(\d+)/);
      if (match) {
        const [, guildId, channelId, messageId] = match;
        if (guildId !== interaction.guildId) {
          return interaction.reply({ content: '❌ Message link must be from this server.', ephemeral: true });
        }

        const channel = interaction.guild.channels.cache.get(channelId);
        if (channel) {
          const message = await channel.messages.fetch(messageId).catch(() => null);
          if (message) {
            targetUserId = message.author.id;
            evidenceContent = `${reason}\n\n**Message content:** ${message.content}`;
          }
        }
      }
    }

    if (!targetUserId) {
      return interaction.reply({ content: '❌ Could not determine target user. Please provide a valid message link or use @mention.', ephemeral: true });
    }

    const caseDoc = await Case.create({
      caseId: generateCaseId(),
      guildId: interaction.guildId,
      type: 'manual',
      module: 'flag',
      severity: 'medium',
      targetUserId,
      reporterId: interaction.user.id,
      evidence: { content: evidenceContent, confidenceScore: 0 },
      status: 'pending',
      punishment: 'none',
    });

    const caseLogsChannel = guildDoc?.logChannels?.caseLogs
      ? interaction.guild.channels.cache.get(guildDoc.logChannels.caseLogs)
      : null;

    if (caseLogsChannel) {
      await sendLog(interaction.client, interaction.guildId, 'caseLogs', {
        title: 'User Flagged by Staff',
        description: `Case ${caseDoc.caseId}`,
        fields: [
          { name: 'Flagged By', value: `<@${interaction.user.id}>`, inline: true },
          { name: 'Target', value: `<@${targetUserId}>`, inline: true },
          { name: 'Reason', value: reason.substring(0, 1024), inline: false },
        ],
      });
    }

    await interaction.reply({
      content: `🚩 Case created: **${caseDoc.caseId}**\n\n**Target:** <@${targetUserId}>\n**Reason:** ${reason}`,
      ephemeral: true,
    });
  },
};