const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lockdown')
    .setDescription('Server-wide channel lock')
    .addStringOption(o => o.setName('state').setDescription('Lockdown state').setRequired(true).addChoices(
      { name: 'On', value: 'on' },
      { name: 'Off', value: 'off' },
    )),
  async execute(interaction) {
    await interaction.reply({ content: 'Lockdown command — not yet implemented', ephemeral: true });
  },
};
