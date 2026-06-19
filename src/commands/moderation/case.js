const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('case')
    .setDescription('View a specific case file')
    .addSubcommand(sc => sc
      .setName('view')
      .setDescription('View case details')
      .addStringOption(o => o.setName('id').setDescription('Case ID').setRequired(true))),
  async execute(interaction) {
    await interaction.reply({ content: 'Case view command — not yet implemented', ephemeral: true });
  },
};
