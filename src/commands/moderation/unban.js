const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Unban a user by their ID')
    .addStringOption(o => o.setName('userid').setDescription('User ID to unban').setRequired(true)),
  async execute(interaction) {
    await interaction.reply({ content: 'Unban command — not yet implemented', ephemeral: true });
  },
};
