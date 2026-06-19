const { SlashCommandBuilder } = require('discord.js');
const Guild = require('../../models/Guild');
const User = require('../../models/User');
const Case = require('../../models/Case');
const { generateCaseId } = require('../../utils/caseId');
const { buildModActionEmbed } = require('../../utils/embeds');
const { TIERS, getTier } = require('../../middleware/permissions');

function parseDuration(durationStr) {
  if (!durationStr) return null;
  const match = durationStr.match(/^(\d+)(s|m|h|d)$/i);
  if (!match) return null;

  const value = parseInt(match[1], 10);
  const unit = match[2].toLowerCase();

  switch (unit) {
    case 's': return value * 1000;
    case 'm': return value * 60000;
    case 'h': return value * 3600000;
    case 'd': return value * 86400000;
    default: return null;
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a user from the server')
    .addUserOption(o => o.setName('user').setDescription('Target user').setRequired(true))
    .addStringOption(o => o.setName('duration').setDescription('Duration (e.g. 1d, 7d) or permanent').setRequired(false))
    .addStringOption(o => o.setName('reason').setDescription('Ban reason').setRequired(false)),
  async execute(interaction) {
    if (!interaction.memberPermissions?.has('BanMembers')) {
      const guildDoc = await Guild.findOne({ guildId: interaction.guildId });
      if (getTier(interaction.member, guildDoc) < TIERS.BOT_MODERATOR) {
        return interaction.reply({ content: '❌ You do not have permission to ban users.', ephemeral: true });
      }
    }

    const user = interaction.options.getUser('user', true);
    const durationStr = interaction.options.getString('duration');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    if (user.id === interaction.client.user.id) {
      return interaction.reply({ content: '❌ You cannot ban the bot.', ephemeral: true });
    }

    const targetMember = await interaction.guild.members.fetch(user.id).catch(() => null);
    if (targetMember && !targetMember.bannable) {
      return interaction.reply({ content: '❌ Cannot ban this user (higher role or unmanageable).', ephemeral: true });
    }

    const durationMs = parseDuration(durationStr);
    const deleteMessageSeconds = durationMs ? 7 * 86400 : 0;

    await interaction.guild.members.ban(user.id, {
      reason,
      deleteMessageSeconds,
    });

    const userDoc = await User.findOneAndUpdate(
      { userId: user.id, guildId: interaction.guildId },
      { userId: user.id, guildId: interaction.guildId },
      { upsert: true, new: true },
    );

    const caseDoc = await Case.create({
      caseId: generateCaseId(),
      guildId: interaction.guildId,
      type: 'manual',
      module: 'ban',
      severity: 'critical',
      targetUserId: user.id,
      reporterId: interaction.user.id,
      evidence: { content: reason, confidenceScore: 100 },
      status: 'resolved',
      punishment: 'ban',
      resolvedAt: new Date(),
    });

    userDoc.history.push(caseDoc._id);
    await userDoc.save();

    const logChannel = interaction.guild.channels.cache.get(
      (await Guild.findOne({ guildId: interaction.guildId }))?.logChannels?.modActions
    );

    if (logChannel) {
      const embed = buildModActionEmbed('Ban', interaction.user, user, durationStr ? `${reason} (${durationStr})` : reason);
      await logChannel.send({ embeds: [embed] }).catch(() => {});
    }

    try {
      await user.send(`You were banned from **${interaction.guild.name}**\n\n**Reason:** ${reason}${durationStr ? `\n**Duration:** ${durationStr}` : ''}`);
    } catch (err) {}

    return interaction.reply({ content: `✅ Banned <@${user.id}>${durationStr ? ` for **${durationStr}**` : ''}.` });
  },
};