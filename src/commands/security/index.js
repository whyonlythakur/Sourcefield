const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('security')
    .setDescription('Media security system settings')
    .addSubcommand(sc => sc.setName('level').setDescription('Set server security level')
      .addStringOption(o => o.setName('level').setDescription('Security level').setRequired(true).addChoices(
        { name: 'Low (max 2 attachments)', value: 'low' },
        { name: 'Moderate (max 1 attachment)', value: 'moderate' },
        { name: 'High (media review required)', value: 'high' },
      )))
    .addSubcommand(sc => sc.setName('mediachannel').setDescription('Set the approved media channel')
      .addChannelOption(o => o.setName('channel').setDescription('Media channel').setRequired(true)))
    .addSubcommand(sc => sc.setName('reviewchannel').setDescription('Set the media review channel')
      .addChannelOption(o => o.setName('channel').setDescription('Review channel').setRequired(true)))
    .addSubcommand(sc => sc.setName('trustedrole').setDescription('Set the trusted media uploader role')
      .addRoleOption(o => o.setName('role').setDescription('Trusted role').setRequired(true)))
    .addSubcommand(sc => sc.setName('autoescalate').setDescription('Auto-escalate to High during raids')
      .addStringOption(o => o.setName('state').setDescription('On or off').setRequired(true).addChoices(
        { name: 'On', value: 'on' },
        { name: 'Off', value: 'off' },
      )))
    .addSubcommand(sc => sc.setName('status').setDescription('Show current security configuration')),
  async execute(interaction) {
    await interaction.reply({ content: 'Security command — not yet implemented', ephemeral: true });
  },
};
