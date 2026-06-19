const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('Remove timeout from a user')
    .addUserOption(o => o.setName('user').setDescription('Target user').setRequired(true)),
  async execute(interaction) {
    await interaction.reply({ content: 'Unmute command — not yet implemented', ephemeral: true });
  },
};
