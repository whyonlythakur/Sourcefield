const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('prefix')
    .setDescription('Change the bot prefix')
    .addSubcommand(sc => sc.setName('set').setDescription('Set a new prefix')
      .addStringOption(o => o.setName('symbol').setDescription('New prefix symbol (1-3 chars)').setRequired(true).setMaxLength(3))),
  async execute(interaction) {
    await interaction.reply({ content: 'Prefix command — not yet implemented', ephemeral: true });
  },
};
