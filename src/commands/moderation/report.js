const { SlashCommandBuilder } = require('discord.js');
const Guild = require('../../models/Guild');
const Case = require('../../models/Case');
const { generateCaseId } = require('../../utils/caseId');
const { sendLog } = require('../../handlers/logHandler');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('report')
    .setDescription('Report a user to the moderation team')
    .addUserOption(o => o.setName('user').setDescription('User to report').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Report reason').setRequired(true)),
  async execute(interaction) {
    const user = interaction.options.getUser('user', true);
    const reason = interaction.options.getString('reason', true);

    if (user.id === interaction.user.id) {
      return interaction.reply({ content: '❌ You cannot report yourself.', ephemeral: true });
    }

    if (user.id === interaction.client.user.id) {
      return interaction.reply({ content: '❌ You cannot report the bot.', ephemeral: true });
    }

    const caseDoc = await Case.create({
      caseId: generateCaseId(),
      guildId: interaction.guildId,
      type: 'manual',
      module: 'report',
      severity: 'medium',
      targetUserId: user.id,
      reporterId: interaction.user.id,
      evidence: { content: reason, confidenceScore: 0 },
      status: 'pending',
      punishment: 'none',
    });

    const guildDoc = await Guild.findOne({ guildId: interaction.guildId });
    const caseLogsChannel = guildDoc?.logChannels?.caseLogs
      ? interaction.guild.channels.cache.get(guildDoc.logChannels.caseLogs)
      : null;

    if (caseLogsChannel) {
      await sendLog(interaction.client, interaction.guildId, 'caseLogs', {
        title: 'New Report Created',
        description: `Case ${caseDoc.caseId}`,
        fields: [
          { name: 'Reporter', value: `<@${interaction.user.id}>`, inline: true },
          { name: 'Reported', value: `<@${user.id}>`, inline: true },
          { name: 'Reason', value: reason.substring(0, 1024), inline: false },
        ],
      });
    }

    const staffPing = guildDoc?.staff?.length > 0
      ? guildDoc.staff.filter(s => ['admin', 'moderator'].includes(s.role)).map(s => `<@${s.userId}>`).join(' ')
      : '@here';

    await interaction.reply({
      content: `${staffPing}\n📬 New report: **${caseDoc.caseId}**\n\n**Reported:** <@${user.id}>\n**Reason:** ${reason}`,
      ephemeral: false,
    });

    try {
      await interaction.user.send(`✅ Your report has been submitted.\n\n**Case ID:** ${caseDoc.caseId}\n**Reported:** ${user.tag}\n**Reason:** ${reason}\n\nThe moderation team will review it shortly.`);
    } catch (err) {}

    setTimeout(async () => {
      try {
        await interaction.editReply({ content: `📬 Report submitted: **${caseDoc.caseId}**`, embeds: [], allowedMentions: { parse: [] } });
      } catch (err) {}
    }, 5000);
  },
};