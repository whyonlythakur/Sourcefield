const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('verification')
    .setDescription('Configure join verification gate')
    .addSubcommand(sc => sc.setName('setup').setDescription('Set up the verification gate')
      .addStringOption(o => o.setName('type').setDescription('Verification type').setRequired(true).addChoices(
        { name: 'Reaction', value: 'reaction' },
        { name: 'Captcha', value: 'captcha' },
      ))
      .addRoleOption(o => o.setName('gaterole').setDescription('Role assigned after verification').setRequired(true))),
  async execute(interaction) {
    await interaction.reply({ content: 'Verification command — not yet implemented', ephemeral: true });
  },
};
