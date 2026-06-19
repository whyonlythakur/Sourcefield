const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('raidmode')
    .setDescription('Toggle raid lockdown mode')
    .addStringOption(o => o.setName('state').setDescription('Raid mode state').setRequired(true).addChoices(
      { name: 'On', value: 'on' },
      { name: 'Off', value: 'off' },
      { name: 'Auto', value: 'auto' },
    )),
  async execute(interaction) {
    await interaction.reply({ content: 'Raidmode command — not yet implemented', ephemeral: true });
  },
};
