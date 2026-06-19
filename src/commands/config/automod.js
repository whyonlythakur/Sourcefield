const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('automod')
    .setDescription('Configure automod modules')
    .addSubcommand(sc => sc.setName('module').setDescription('Enable/disable a module')
      .addStringOption(o => o.setName('name').setDescription('Module name').setRequired(true).setAutocomplete(true))
      .addStringOption(o => o.setName('action').setDescription('Enable or disable').setRequired(true).addChoices(
        { name: 'Enable', value: 'enable' },
        { name: 'Disable', value: 'disable' },
      )))
    .addSubcommand(sc => sc.setName('threshold').setDescription('Adjust module sensitivity')
      .addStringOption(o => o.setName('name').setDescription('Module name').setRequired(true).setAutocomplete(true))
      .addIntegerOption(o => o.setName('value').setDescription('Threshold value').setRequired(true)))
    .addSubcommand(sc => sc.setName('punishment').setDescription('Set punishment ladder for a module')
      .addStringOption(o => o.setName('name').setDescription('Module name').setRequired(true).setAutocomplete(true))
      .addStringOption(o => o.setName('ladder').setDescription('Comma-separated ladder: warn,mute,kick,ban').setRequired(true))),
  async execute(interaction) {
    await interaction.reply({ content: 'Automod config command — not yet implemented', ephemeral: true });
  },
};
