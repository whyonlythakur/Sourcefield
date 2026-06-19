const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('report')
    .setDescription('Report a user to the moderation team')
    .addUserOption(o => o.setName('user').setDescription('User to report').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Report reason').setRequired(true)),
  async execute(interaction) {
    await interaction.reply({ content: 'Report command — not yet implemented', ephemeral: true });
  },
};
