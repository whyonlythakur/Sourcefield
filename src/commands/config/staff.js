const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('staff')
    .setDescription('Manage bot staff roles')
    .addSubcommand(sc => sc.setName('add').setDescription('Add a staff member')
      .addUserOption(o => o.setName('user').setDescription('User to add').setRequired(true))
      .addStringOption(o => o.setName('role').setDescription('Staff role').setRequired(true).addChoices(
        { name: 'Admin', value: 'admin' },
        { name: 'Moderator', value: 'moderator' },
        { name: 'Reporter', value: 'reporter' },
      )))
    .addSubcommand(sc => sc.setName('remove').setDescription('Remove a staff member')
      .addUserOption(o => o.setName('user').setDescription('User to remove').setRequired(true))),
  async execute(interaction) {
    await interaction.reply({ content: 'Staff command — not yet implemented', ephemeral: true });
  },
};
