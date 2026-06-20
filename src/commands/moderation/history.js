const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Case = require('../../models/Case');
const User = require('../../models/User');
const Guild = require('../../models/Guild');
const { TIERS, getTier } = require('../../middleware/permissions');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('history')
    .setDescription('View full punishment history for a user')
    .addUserOption(o => o.setName('user').setDescription('Target user').setRequired(true)),
  async execute(interaction) {
    const guildDoc = await Guild.findOne({ guildId: interaction.guildId });
    if (getTier(interaction.member, guildDoc) < TIERS.BOT_MODERATOR) {
      return interaction.reply({ content: '❌ Only moderators can view history.', ephemeral: true });
    }

    const user = interaction.options.getUser('user', true);
    const userDoc = await User.findOne({ userId: user.id, guildId: interaction.guildId });

    if (!userDoc || userDoc.history.length === 0) {
      return interaction.reply({ content: `📋 <@${user.id}> has no moderation history in this server.`, ephemeral: true });
    }

    const cases = await Case.find({ _id: { $in: userDoc.history } }).sort({ createdAt: -1 }).limit(10);

    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle(`Moderation History - ${user.username}`)
      .addFields(
        { name: 'Total Warn Points', value: `${userDoc.warnPoints}`, inline: true },
        { name: 'Total Cases', value: `${userDoc.history.length}`, inline: true },
        { name: 'Account Age', value: `${Math.floor((Date.now() - user.createdTimestamp) / 86400000)} days`, inline: true },
      )
      .setFooter({ text: `User ID: ${user.id}` })
      .setTimestamp();

    if (cases.length > 0) {
      const recentCases = cases.map((c, i) => {
        const emoji = c.punishment === 'ban' ? '🔨' : c.punishment === 'kick' ? '👢' : c.punishment === 'mute' ? '🔇' : '⚠️';
        return `${i + 1}. ${emoji} **${c.caseId}** - ${c.module || 'Manual'} (${c.status})`;
      }).join('\n');

      embed.addFields({ name: `Recent Cases (Last 10)`, value: recentCases, inline: false });
    }

    return interaction.reply({ embeds: [embed], ephemeral: true });
  },
};