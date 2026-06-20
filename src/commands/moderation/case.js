const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Case = require('../../models/Case');
const { buildCaseEmbed } = require('../../utils/embeds');
const { TIERS, getTier } = require('../../middleware/permissions');
const Guild = require('../../models/Guild');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('case')
    .setDescription('View a specific case file')
    .addSubcommand(sc => sc
      .setName('view')
      .setDescription('View case details')
      .addStringOption(o => o.setName('id').setDescription('Case ID').setRequired(true))),
  async execute(interaction) {
    const guildDoc = await Guild.findOne({ guildId: interaction.guildId });
    if (getTier(interaction.member, guildDoc) < TIERS.BOT_MODERATOR) {
      return interaction.reply({ content: '❌ Only moderators can view cases.', ephemeral: true });
    }

    const caseId = interaction.options.getString('id', true);
    const caseDoc = await Case.findOne({ caseId });

    if (!caseDoc) {
      return interaction.reply({ content: `❌ Case ${caseId} not found.`, ephemeral: true });
    }

    if (caseDoc.guildId !== interaction.guildId) {
      return interaction.reply({ content: '❌ Case not found in this server.', ephemeral: true });
    }

    const embed = buildCaseEmbed(caseDoc);
    return interaction.reply({ embeds: [embed], ephemeral: true });
  },
};