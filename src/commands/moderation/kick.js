const { SlashCommandBuilder } = require('discord.js');
const Guild = require('../../models/Guild');
const User = require('../../models/User');
const Case = require('../../models/Case');
const { generateCaseId } = require('../../utils/caseId');
const { buildModActionEmbed } = require('../../utils/embeds');
const { TIERS, getTier } = require('../../middleware/permissions');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a user from the server')
    .addUserOption(o => o.setName('user').setDescription('Target user').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Kick reason').setRequired(false)),
  async execute(interaction) {
    if (!interaction.memberPermissions?.has('KickMembers')) {
      const guildDoc = await Guild.findOne({ guildId: interaction.guildId });
      if (getTier(interaction.member, guildDoc) < TIERS.BOT_MODERATOR) {
        return interaction.reply({ content: '❌ You do not have permission to kick users.', ephemeral: true });
      }
    }

    const user = interaction.options.getUser('user', true);
    const reason = interaction.options.getString('reason') || 'No reason provided';

    if (user.id === interaction.client.user.id) {
      return interaction.reply({ content: '❌ You cannot kick the bot.', ephemeral: true });
    }

    const targetMember = await interaction.guild.members.fetch(user.id).catch(() => null);
    if (!targetMember) {
      return interaction.reply({ content: '❌ User not found in this server.', ephemeral: true });
    }

    if (!targetMember.kickable) {
      return interaction.reply({ content: '❌ Cannot kick this user (higher role or unmanageable).', ephemeral: true });
    }

    await targetMember.kick(reason);

    const userDoc = await User.findOneAndUpdate(
      { userId: user.id, guildId: interaction.guildId },
      { userId: user.id, guildId: interaction.guildId },
      { upsert: true, new: true },
    );

    const caseDoc = await Case.create({
      caseId: generateCaseId(),
      guildId: interaction.guildId,
      type: 'manual',
      module: 'kick',
      severity: 'high',
      targetUserId: user.id,
      reporterId: interaction.user.id,
      evidence: { content: reason, confidenceScore: 100 },
      status: 'resolved',
      punishment: 'kick',
      resolvedAt: new Date(),
    });

    userDoc.history.push(caseDoc._id);
    await userDoc.save();

    const logChannel = interaction.guild.channels.cache.get(
      (await Guild.findOne({ guildId: interaction.guildId }))?.logChannels?.modActions
    );

    if (logChannel) {
      const embed = buildModActionEmbed('Kick', interaction.user, user, reason);
      await logChannel.send({ embeds: [embed] }).catch(() => {});
    }

    try {
      await user.send(`You were kicked from **${interaction.guild.name}**\n\n**Reason:** ${reason}`);
    } catch (err) {}

    return interaction.reply({ content: `✅ Kicked <@${user.id}>.` });
  },
};