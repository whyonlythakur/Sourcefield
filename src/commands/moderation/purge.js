const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Bulk delete messages')
    .addIntegerOption(o => o.setName('count').setDescription('Number of messages to delete').setRequired(true).setMinValue(1).setMaxValue(100))
    .addStringOption(o => o.setName('filter').setDescription('Filter: user, bot, attachments, links').setRequired(false)),
  async execute(interaction) {
    await interaction.reply({ content: 'Purge command — not yet implemented', ephemeral: true });
  },
};
