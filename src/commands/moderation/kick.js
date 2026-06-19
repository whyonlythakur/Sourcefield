const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a user from the server')
    .addUserOption(o => o.setName('user').setDescription('Target user').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Kick reason').setRequired(false)),
  async execute(interaction) {
    await interaction.reply({ content: 'Kick command — not yet implemented', ephemeral: true });
  },
};
