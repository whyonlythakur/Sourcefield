const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('wordfilter')
    .setDescription('Manage custom word/phrase blacklist')
    .addSubcommand(sc => sc.setName('add').setDescription('Add a word or regex pattern')
      .addStringOption(o => o.setName('pattern').setDescription('Word or regex pattern to block').setRequired(true)))
    .addSubcommand(sc => sc.setName('remove').setDescription('Remove a word or regex pattern')
      .addStringOption(o => o.setName('pattern').setDescription('Word or regex pattern to remove').setRequired(true))),
  async execute(interaction) {
    await interaction.reply({ content: 'Wordfilter command — not yet implemented', ephemeral: true });
  },
};
