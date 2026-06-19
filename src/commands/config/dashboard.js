const { SlashCommandBuilder } = require('discord.js');
const config = require('../../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dashboard')
    .setDescription('Get a link to this server\'s dashboard'),
  async execute(interaction) {
    const url = `${config.dashboardUrl}/${interaction.guildId}/overview`;
    await interaction.reply({ content: `Dashboard: ${url}`, ephemeral: true });
  },
};
