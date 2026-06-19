const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('linkfilter')
    .setDescription('Manage domain allow/block lists')
    .addSubcommand(sc => sc.setName('allow').setDescription('Allow a domain')
      .addStringOption(o => o.setName('domain').setDescription('Domain to allow').setRequired(true)))
    .addSubcommand(sc => sc.setName('block').setDescription('Block a domain')
      .addStringOption(o => o.setName('domain').setDescription('Domain to block').setRequired(true))),
  async execute(interaction) {
    await interaction.reply({ content: 'Linkfilter command — not yet implemented', ephemeral: true });
  },
};
