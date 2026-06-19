const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('flag')
    .setDescription('Staff: manually flag a message or user')
    .addStringOption(o => o.setName('message_link').setDescription('Discord message link').setRequired(false))
    .addStringOption(o => o.setName('reason').setDescription('Flag reason').setRequired(true)),
  async execute(interaction) {
    await interaction.reply({ content: 'Flag command — not yet implemented', ephemeral: true });
  },
};
