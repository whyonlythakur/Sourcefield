const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('config')
    .setDescription('Export or import bot configuration')
    .addSubcommand(sc => sc.setName('export').setDescription('Export full config as JSON'))
    .addSubcommand(sc => sc.setName('import').setDescription('Import config from JSON')
      .addAttachmentOption(o => o.setName('file').setDescription('JSON config file').setRequired(true))),
  async execute(interaction) {
    await interaction.reply({ content: 'Config export/import command — not yet implemented', ephemeral: true });
  },
};
