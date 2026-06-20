const { SlashCommandBuilder } = require('discord.js');
const Guild = require('../../models/Guild');
const { TIERS, getTier } = require('../../middleware/permissions');

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
    const subcommand = interaction.options.getSubcommand();
    const guildDoc = await Guild.findOne({ guildId: interaction.guildId });

    if (getTier(interaction.member, guildDoc) < TIERS.BOT_ADMIN) {
      return interaction.reply({ content: '❌ Only Bot Admins can manage security settings.', ephemeral: true });
    }

    if (subcommand === 'level') {
      const level = interaction.options.getString('level', true);
      if (!guildDoc) {
        await Guild.create({ guildId: interaction.guildId, security: { level } });
      } else {
        guildDoc.security.level = level;
        await guildDoc.save();
      }
      return interaction.reply({ content: `✅ Security level set to **${level.toUpperCase()}**`, ephemeral: false });
    }

    if (subcommand === 'mediachannel') {
      const channel = interaction.options.getChannel('channel', true);
      if (!guildDoc) {
        await Guild.create({ guildId: interaction.guildId, security: { mediaChannelId: channel.id } });
      } else {
        guildDoc.security.mediaChannelId = channel.id;
        await guildDoc.save();
      }
      return interaction.reply({ content: `✅ Media channel set to <#${channel.id}>`, ephemeral: false });
    }

    if (subcommand === 'reviewchannel') {
      const channel = interaction.options.getChannel('channel', true);
      if (!guildDoc) {
        await Guild.create({ guildId: interaction.guildId, security: { reviewChannelId: channel.id } });
      } else {
        guildDoc.security.reviewChannelId = channel.id;
        await guildDoc.save();
      }
      return interaction.reply({ content: `✅ Review channel set to <#${channel.id}>`, ephemeral: false });
    }

    if (subcommand === 'trustedrole') {
      const role = interaction.options.getRole('role', true);
      if (!guildDoc) {
        await Guild.create({ guildId: interaction.guildId, security: { trustedRoleId: role.id } });
      } else {
        guildDoc.security.trustedRoleId = role.id;
        await guildDoc.save();
      }
      return interaction.reply({ content: `✅ Trusted role set to <@&${role.id}>`, ephemeral: false });
    }

    if (subcommand === 'autoescalate') {
      const state = interaction.options.getString('state', true);
      if (!guildDoc) {
        await Guild.create({ guildId: interaction.guildId, security: { autoEscalateOnRaid: state === 'on' } });
      } else {
        guildDoc.security.autoEscalateOnRaid = state === 'on';
        await guildDoc.save();
      }
      return interaction.reply({ content: `✅ Auto-escalate ${state === 'on' ? 'enabled' : 'disabled'}`, ephemeral: false });
    }

    if (subcommand === 'status') {
      if (!guildDoc || !guildDoc.security) {
        return interaction.reply({ content: '📋 No security configuration found.', ephemeral: true });
      }

      const embed = {
        title: 'Security Configuration',
        fields: [
          { name: 'Security Level', value: `**${guildDoc.security.level || 'low'}**`, inline: true },
          { name: 'Media Channel', value: guildDoc.security.mediaChannelId ? `<#${guildDoc.security.mediaChannelId}>` : 'Not set', inline: true },
          { name: 'Review Channel', value: guildDoc.security.reviewChannelId ? `<#${guildDoc.security.reviewChannelId}>` : 'Not set', inline: true },
          { name: 'Trusted Role', value: guildDoc.security.trustedRoleId ? `<@&${guildDoc.security.trustedRoleId}>` : 'Not set', inline: true },
          { name: 'Auto-Escalate', value: guildDoc.security.autoEscalateOnRaid ? '✅ Enabled' : '❌ Disabled', inline: true },
        ],
      };

      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    return interaction.reply({ content: 'Unknown subcommand', ephemeral: true });
  },
};