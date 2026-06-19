const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('logs')
    .setDescription('Configure log channels')
    .addSubcommand(sc => sc.setName('setchannel').setDescription('Route a log category to a channel')
      .addStringOption(o => o.setName('category').setDescription('Log category').setRequired(true).addChoices(
        { name: 'Mod Actions', value: 'modActions' },
        { name: 'AutoMod Triggers', value: 'automodTriggers' },
        { name: 'Message Logs', value: 'messageLogs' },
        { name: 'Member Logs', value: 'memberLogs' },
        { name: 'Raid Logs', value: 'raidLogs' },
        { name: 'Case Logs', value: 'caseLogs' },
        { name: 'Server Logs', value: 'serverLogs' },
        { name: 'Error Logs', value: 'errorLogs' },
      ))
      .addChannelOption(o => o.setName('channel').setDescription('Channel for this log category').setRequired(true))),
  async execute(interaction) {
    await interaction.reply({ content: 'Logs config command — not yet implemented', ephemeral: true });
  },
};
