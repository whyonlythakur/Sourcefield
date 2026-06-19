const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('history')
    .setDescription('View full punishment history for a user')
    .addUserOption(o => o.setName('user').setDescription('Target user').setRequired(true)),
  async execute(interaction) {
    await interaction.reply({ content: 'History command — not yet implemented', ephemeral: true });
  },
};
