const { SlashCommandBuilder } = require('discord.js');
const Guild = require('../../models/Guild');
const { TIERS, getTier } = require('../../middleware/permissions');
const lockdownModule = require('../../modules/lockdown');

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
    const state = interaction.options.getString('state', true);
    const guildDoc = await Guild.findOne({ guildId: interaction.guildId });

    if (getTier(interaction.member, guildDoc) < TIERS.BOT_ADMIN) {
      return interaction.reply({ content: '❌ Only Bot Admins can toggle raid mode.', ephemeral: true });
    }

    if (state === 'on') {
      const lockdownEnabled = await lockdownModule.enableLockdown(interaction.guild, interaction.client.redis);
      if (lockdownEnabled) {
        await interaction.reply({ content: '🚨 **RAID MODE ACTIVATED** 🚨\n\nServer-wide lockdown enabled. All channels locked.', ephemeral: false });
      }
    } else if (state === 'off') {
      const lockdownDisabled = await lockdownModule.disableLockdown(interaction.guild, interaction.client.redis);
      if (lockdownDisabled) {
        await interaction.reply({ content: '✅ **RAID MODE DEACTIVATED**\n\nServer-wide lockdown disabled. Channels unlocked.', ephemeral: false });
      }
    } else if (state === 'auto') {
      if (!guildDoc) {
        await Guild.create({ guildId: interaction.guildId, modules: { antiRaid: { enabled: true, autoLockdown: true } } });
      } else {
        guildDoc.modules.antiRaid.autoLockdown = true;
        await guildDoc.save();
      }
      await interaction.reply({ content: '✅ **AUTO RAID MODE** enabled\n\nLockdown will activate automatically when raid is detected.', ephemeral: false });
    }

    return interaction.reply({ content: 'Raid mode command executed', ephemeral: true });
  },
};