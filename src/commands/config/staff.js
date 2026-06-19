const { SlashCommandBuilder } = require('discord.js');
const Guild = require('../../models/Guild');
const { TIERS, getTier } = require('../../middleware/permissions');

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
    const subcommand = interaction.options.getSubcommand();
    const guildDoc = await Guild.findOne({ guildId: interaction.guildId });

    if (subcommand === 'add') {
      const user = interaction.options.getUser('user', true);
      const role = interaction.options.getString('role', true);

      const memberTier = getTier(interaction.member, guildDoc);
      if (memberTier < TIERS.BOT_ADMIN) {
        return interaction.reply({ content: '❌ Only Bot Admins can modify staff.', ephemeral: true });
      }

      if (!guildDoc) {
        return interaction.reply({ content: '❌ Guild not found in database.', ephemeral: true });
      }

      const existingStaff = guildDoc.staff.find(s => s.userId === user.id);
      if (existingStaff) {
        existingStaff.role = role;
        await guildDoc.save();
        return interaction.reply({ content: `✅ Updated <@${user.id}> to **${role}**.`, ephemeral: true });
      }

      guildDoc.staff.push({ userId: user.id, role });
      await guildDoc.save();

      return interaction.reply({ content: `✅ Added <@${user.id}> as **${role}**.`, ephemeral: true });
    }

    if (subcommand === 'remove') {
      const user = interaction.options.getUser('user', true);

      const memberTier = getTier(interaction.member, guildDoc);
      if (memberTier < TIERS.BOT_ADMIN) {
        return interaction.reply({ content: '❌ Only Bot Admins can modify staff.', ephemeral: true });
      }

      if (!guildDoc) {
        return interaction.reply({ content: '❌ Guild not found in database.', ephemeral: true });
      }

      const staffIndex = guildDoc.staff.findIndex(s => s.userId === user.id);
      if (staffIndex === -1) {
        return interaction.reply({ content: '❌ User is not on the staff team.', ephemeral: true });
      }

      guildDoc.staff.splice(staffIndex, 1);
      await guildDoc.save();

      return interaction.reply({ content: `✅ Removed <@${user.id}> from staff.`, ephemeral: true });
    }
  },
};