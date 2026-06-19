const { SlashCommandBuilder } = require('discord.js');
const Guild = require('../../models/Guild');
const User = require('../../models/User');
const Case = require('../../models/Case');
const { generateCaseId } = require('../../utils/caseId');
const { buildModActionEmbed } = require('../../utils/embeds');
const { TIERS, getTier } = require('../../middleware/permissions');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Issue a warning to a user')
    .addUserOption(o => o.setName('user').setDescription('Target user').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Warning reason').setRequired(false)),
  async execute(interaction) {
    if (!interaction.memberPermissions?.has('ModerateMembers')) {
      const guildDoc = await Guild.findOne({ guildId: interaction.guildId });
      if (getTier(interaction.member, guildDoc) < TIERS.BOT_MODERATOR) {
        return interaction.reply({ content: '❌ You do not have permission to warn users.', ephemeral: true });
      }
    }

    const user = interaction.options.getUser('user', true);
    const reason = interaction.options.getString('reason') || 'No reason provided';

    if (user.id === interaction.client.user.id) {
      return interaction.reply({ content: '❌ You cannot warn the bot.', ephemeral: true });
    }

    if (user.id === interaction.user.id) {
      return interaction.reply({ content: '❌ You cannot warn yourself.', ephemeral: true });
    }

    const targetMember = await interaction.guild.members.fetch(user.id).catch(() => null);
    if (!targetMember) {
      return interaction.reply({ content: '❌ User not found in this server.', ephemeral: true });
    }

    const userDoc = await User.findOneAndUpdate(
      { userId: user.id, guildId: interaction.guildId },
      { userId: user.id, guildId: interaction.guildId, $inc: { warnPoints: 1 } },
      { upsert: true, new: true },
    );

    const caseDoc = await Case.create({
      caseId: generateCaseId(),
      guildId: interaction.guildId,
      type: 'manual',
      module: 'warn',
      severity: 'low',
      targetUserId: user.id,
      reporterId: interaction.user.id,
      evidence: { content: reason, confidenceScore: 100 },
      status: 'resolved',
      punishment: 'warn',
      resolvedAt: new Date(),
    });

    userDoc.history.push(caseDoc._id);
    await userDoc.save();

    const logChannel = interaction.guild.channels.cache.get(
      (await Guild.findOne({ guildId: interaction.guildId }))?.logChannels?.modActions
    );

    if (logChannel) {
      const embed = buildModActionEmbed('Warn', interaction.user, user, reason);
      await logChannel.send({ embeds: [embed] }).catch(() => {});
    }

    try {
      await user.send(`You received a warning in **${interaction.guild.name}**\n\n**Reason:** ${reason}\n\nYou now have **${userDoc.warnPoints}** warn points.`);
    } catch (err) {}

    return interaction.reply({ content: `✅ Warned <@${user.id}>. They now have **${userDoc.warnPoints}** warn points.`, ephemeral: false });
  },
};