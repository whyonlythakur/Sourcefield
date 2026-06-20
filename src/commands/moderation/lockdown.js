const { SlashCommandBuilder } = require('discord.js');
const lockdownModule = require('../../modules/lockdown');
const Guild = require('../../models/Guild');
const { TIERS, getTier } = require('../../middleware/permissions');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lockdown')
    .setDescription('Server-wide channel lock')
    .addStringOption(o => o.setName('state').setDescription('Lockdown state').setRequired(true).addChoices(
      { name: 'On', value: 'on' },
      { name: 'Off', value: 'off' },
    )),
  async execute(interaction) {
    if (getTier(interaction.member, await Guild.findOne({ guildId: interaction.guildId })) < TIERS.BOT_ADMIN) {
      return interaction.reply({ content: '❌ Only Bot Admins can toggle lockdown.', ephemeral: true });
    }

    const state = interaction.options.getString('state', true);

    if (state === 'on') {
      const enabled = await lockdownModule.enableLockdown(interaction.guild, interaction.client.redis);
      if (enabled) {
        await interaction.reply({ content: '🔒 **LOCKDOWN ENABLED**\n\nAll channels locked. Only staff can send messages.', ephemeral: false });
      }
    } else if (state === 'off') {
      const disabled = await lockdownModule.disableLockdown(interaction.guild, interaction.client.redis);
      if (disabled) {
        await interaction.reply({ content: '🔓 **LOCKDOWN DISABLED**\n\nAll channels unlocked.', ephemeral: false });
      }
    }
  },
};