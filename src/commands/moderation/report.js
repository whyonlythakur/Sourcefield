const { SlashCommandBuilder } = require('discord.js');
const Guild = require('../../models/Guild');
const { createManualReport } = require('../../handlers/reportHandler');
const { TIERS, getTier } = require('../../middleware/permissions');

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

    const caseDoc = await createManualReport(
      interaction.client,
      interaction.guildId,
      user.id,
      interaction.user.id,
      reason
    );

    const guildDoc = await Guild.findOne({ guildId: interaction.guildId });
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