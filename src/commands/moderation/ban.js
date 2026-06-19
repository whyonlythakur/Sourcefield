const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a user from the server')
    .addUserOption(o => o.setName('user').setDescription('Target user').setRequired(true))
    .addStringOption(o => o.setName('duration').setDescription('Duration (e.g. 1d, 7d) or permanent').setRequired(false))
    .addStringOption(o => o.setName('reason').setDescription('Ban reason').setRequired(false)),
  async execute(interaction) {
    await interaction.reply({ content: 'Ban command — not yet implemented', ephemeral: true });
  },
};
