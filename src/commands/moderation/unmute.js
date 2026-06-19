const { SlashCommandBuilder } = require('discord.js');
const Guild = require('../../models/Guild');
const { TIERS, getTier } = require('../../middleware/permissions');
const { buildModActionEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('Remove timeout from a user')
    .addUserOption(o => o.setName('user').setDescription('Target user').setRequired(true)),
  async execute(interaction) {
    if (!interaction.memberPermissions?.has('ModerateMembers')) {
      const guildDoc = await Guild.findOne({ guildId: interaction.guildId });
      if (getTier(interaction.member, guildDoc) < TIERS.BOT_MODERATOR) {
        return interaction.reply({ content: '❌ You do not have permission to unmute users.', ephemeral: true });
      }
    }

    const user = interaction.options.getUser('user', true);
    const targetMember = await interaction.guild.members.fetch(user.id).catch(() => null);

    if (!targetMember) {
      return interaction.reply({ content: '❌ User not found in this server.', ephemeral: true });
    }

    if (!targetMember.isCommunicationDisabled()) {
      return interaction.reply({ content: 'ℹ️ This user is not muted.', ephemeral: true });
    }

    await targetMember.timeout(null, 'Unmuted by moderator');

    const logChannel = interaction.guild.channels.cache.get(
      (await Guild.findOne({ guildId: interaction.guildId }))?.logChannels?.modActions
    );

    if (logChannel) {
      const embed = buildModActionEmbed('Unmute', interaction.user, user, 'Timeout removed');
      await logChannel.send({ embeds: [embed] }).catch(() => {});
    }

    try {
      await user.send(`You were unmuted in **${interaction.guild.name}**.`);
    } catch (err) {}

    return interaction.reply({ content: `✅ Unmuted <@${user.id}>.` });
  },
};