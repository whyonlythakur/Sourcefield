const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Mute/timeout a user')
    .addUserOption(o => o.setName('user').setDescription('Target user').setRequired(true))
    .addStringOption(o => o.setName('duration').setDescription('Duration (e.g. 10m, 1h, 1d)').setRequired(false))
    .addStringOption(o => o.setName('reason').setDescription('Mute reason').setRequired(false)),
  async execute(interaction) {
    await interaction.reply({ content: 'Mute command — not yet implemented', ephemeral: true });
  },
};
