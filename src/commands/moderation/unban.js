const { SlashCommandBuilder } = require('discord.js');
const Guild = require('../../models/Guild');
const Case = require('../../models/Case');
const { generateCaseId } = require('../../utils/caseId');
const { buildModActionEmbed } = require('../../utils/embeds');
const { TIERS, getTier } = require('../../middleware/permissions');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Unban a user by their ID')
    .addStringOption(o => o.setName('userid').setDescription('User ID to unban').setRequired(true)),
  async execute(interaction) {
    if (!interaction.memberPermissions?.has('BanMembers')) {
      const guildDoc = await Guild.findOne({ guildId: interaction.guildId });
      if (getTier(interaction.member, guildDoc) < TIERS.BOT_MODERATOR) {
        return interaction.reply({ content: '❌ You do not have permission to unban users.', ephemeral: true });
      }
    }

    const userId = interaction.options.getString('userid', true);
    if (!/^\d{17,19}$/.test(userId)) {
      return interaction.reply({ content: '❌ Invalid user ID format.', ephemeral: true });
    }

    const bans = await interaction.guild.bans.fetch();
    const ban = bans.get(userId);

    if (!ban) {
      return interaction.reply({ content: '❌ This user is not banned.', ephemeral: true });
    }

    await interaction.guild.members.unban(userId, `Unbanned by ${interaction.user.tag}`);

    const caseDoc = await Case.create({
      caseId: generateCaseId(),
      guildId: interaction.guildId,
      type: 'manual',
      module: 'unban',
      severity: 'medium',
      targetUserId: userId,
      reporterId: interaction.user.id,
      evidence: { content: 'User unbanned', confidenceScore: 100 },
      status: 'resolved',
      punishment: 'none',
      resolvedAt: new Date(),
    });

    const logChannel = interaction.guild.channels.cache.get(
      (await Guild.findOne({ guildId: interaction.guildId }))?.logChannels?.modActions
    );

    if (logChannel) {
      const embed = buildModActionEmbed('Unban', interaction.user, { id: userId, username: ban.user.username, tag: ban.user.tag }, 'Ban removed');
      await logChannel.send({ embeds: [embed] }).catch(() => {});
    }

    return interaction.reply({ content: `✅ Unbanned <@${userId}>.` });
  },
};