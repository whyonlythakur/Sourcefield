const { SlashCommandBuilder } = require('discord.js');
const Guild = require('../../models/Guild');
const User = require('../../models/User');
const Case = require('../../models/Case');
const { generateCaseId } = require('../../utils/caseId');
const { buildModActionEmbed } = require('../../utils/embeds');
const { TIERS, getTier } = require('../../middleware/permissions');

function parseDuration(durationStr) {
  if (!durationStr) return 60000;
  const match = durationStr.match(/^(\d+)(s|m|h|d)$/i);
  if (!match) return 60000;

  const value = parseInt(match[1], 10);
  const unit = match[2].toLowerCase();

  switch (unit) {
    case 's': return value * 1000;
    case 'm': return value * 60000;
    case 'h': return value * 3600000;
    case 'd': return value * 86400000;
    default: return 60000;
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Mute/timeout a user')
    .addUserOption(o => o.setName('user').setDescription('Target user').setRequired(true))
    .addStringOption(o => o.setName('duration').setDescription('Duration (e.g. 10m, 1h, 1d)').setRequired(false))
    .addStringOption(o => o.setName('reason').setDescription('Mute reason').setRequired(false)),
  async execute(interaction) {
    if (!interaction.memberPermissions?.has('ModerateMembers')) {
      const guildDoc = await Guild.findOne({ guildId: interaction.guildId });
      if (getTier(interaction.member, guildDoc) < TIERS.BOT_MODERATOR) {
        return interaction.reply({ content: '❌ You do not have permission to mute users.', ephemeral: true });
      }
    }

    const user = interaction.options.getUser('user', true);
    const durationStr = interaction.options.getString('duration') || '10m';
    const reason = interaction.options.getString('reason') || 'No reason provided';

    if (user.id === interaction.client.user.id) {
      return interaction.reply({ content: '❌ You cannot mute the bot.', ephemeral: true });
    }

    const targetMember = await interaction.guild.members.fetch(user.id).catch(() => null);
    if (!targetMember) {
      return interaction.reply({ content: '❌ User not found in this server.', ephemeral: true });
    }

    if (!targetMember.moderatable) {
      return interaction.reply({ content: '❌ Cannot mute this user (higher role or unmanageable).', ephemeral: true });
    }

    const durationMs = parseDuration(durationStr);
    if (durationMs > 2419200000) {
      return interaction.reply({ content: '❌ Maximum mute duration is 28 days.', ephemeral: true });
    }

    await targetMember.timeout(durationMs, reason);

    const userDoc = await User.findOneAndUpdate(
      { userId: user.id, guildId: interaction.guildId },
      { userId: user.id, guildId: interaction.guildId, $inc: { warnPoints: 2 } },
      { upsert: true, new: true },
    );

    const caseDoc = await Case.create({
      caseId: generateCaseId(),
      guildId: interaction.guildId,
      type: 'manual',
      module: 'mute',
      severity: 'medium',
      targetUserId: user.id,
      reporterId: interaction.user.id,
      evidence: { content: reason, confidenceScore: 100 },
      status: 'resolved',
      punishment: 'mute',
      resolvedAt: new Date(),
    });

    userDoc.history.push(caseDoc._id);
    await userDoc.save();

    const logChannel = interaction.guild.channels.cache.get(
      (await Guild.findOne({ guildId: interaction.guildId }))?.logChannels?.modActions
    );

    if (logChannel) {
      const embed = buildModActionEmbed('Mute', interaction.user, user, `${reason} (${durationStr})`);
      await logChannel.send({ embeds: [embed] }).catch(() => {});
    }

    try {
      await user.send(`You were muted in **${interaction.guild.name}** for **${durationStr}**\n\n**Reason:** ${reason}`);
    } catch (err) {}

    return interaction.reply({ content: `✅ Muted <@${user.id}> for **${durationStr}**.` });
  },
};