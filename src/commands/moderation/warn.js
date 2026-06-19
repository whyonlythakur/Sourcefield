const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Issue a warning to a user')
    .addUserOption(o => o.setName('user').setDescription('Target user').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Warning reason').setRequired(false)),
  async execute(interaction) {
    await interaction.reply({ content: 'Warn command — not yet implemented', ephemeral: true });
  },
};
