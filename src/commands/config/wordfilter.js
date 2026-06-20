const { SlashCommandBuilder } = require('discord.js');
const Guild = require('../../models/Guild');
const { TIERS, getTier } = require('../../middleware/permissions');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('wordfilter')
    .setDescription('Manage custom word/phrase blacklist')
    .addSubcommand(sc => sc.setName('add').setDescription('Add a word or regex pattern')
      .addStringOption(o => o.setName('pattern').setDescription('Word or regex pattern to block').setRequired(true)))
    .addSubcommand(sc => sc.setName('remove').setDescription('Remove a word or regex pattern')
      .addStringOption(o => o.setName('pattern').setDescription('Word or regex pattern to remove').setRequired(true)))
    .addSubcommand(sc => sc.setName('list').setDescription('List all blacklisted patterns')),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const guildDoc = await Guild.findOne({ guildId: interaction.guildId });

    if (getTier(interaction.member, guildDoc) < TIERS.BOT_ADMIN) {
      return interaction.reply({ content: '❌ Only Bot Admins can manage the word filter.', ephemeral: true });
    }

    if (subcommand === 'add') {
      const pattern = interaction.options.getString('pattern', true);

      if (!guildDoc) {
        return interaction.reply({ content: '❌ Guild not found in database.', ephemeral: true });
      }

      if (!guildDoc.modules.customBlacklist) {
        guildDoc.modules.customBlacklist = { enabled: false, patterns: [] };
      }

      if (!guildDoc.modules.customBlacklist.patterns) {
        guildDoc.modules.customBlacklist.patterns = [];
      }

      if (guildDoc.modules.customBlacklist.patterns.includes(pattern)) {
        return interaction.reply({ content: `⚠️ Pattern "${pattern}" is already in the blacklist.`, ephemeral: true });
      }

      try {
        new RegExp(pattern, 'gi');
      } catch (err) {
        return interaction.reply({ content: `❌ Invalid regex pattern: ${err.message}`, ephemeral: true });
      }

      guildDoc.modules.customBlacklist.patterns.push(pattern);
      await guildDoc.save();

      return interaction.reply({
        content: `✅ Added "${pattern}" to the custom blacklist.\n\nTotal patterns: **${guildDoc.modules.customBlacklist.patterns.length}**`,
        ephemeral: false,
      });
    }

    if (subcommand === 'remove') {
      const pattern = interaction.options.getString('pattern', true);

      if (!guildDoc || !guildDoc.modules.customBlacklist?.patterns) {
        return interaction.reply({ content: '❌ No custom blacklist configured.', ephemeral: true });
      }

      const index = guildDoc.modules.customBlacklist.patterns.indexOf(pattern);
      if (index === -1) {
        return interaction.reply({ content: `❌ Pattern "${pattern}" not found in the blacklist.`, ephemeral: true });
      }

      guildDoc.modules.customBlacklist.patterns.splice(index, 1);
      await guildDoc.save();

      return interaction.reply({
        content: `✅ Removed "${pattern}" from the custom blacklist.\n\nRemaining patterns: **${guildDoc.modules.customBlacklist.patterns.length}**`,
        ephemeral: false,
      });
    }

    if (subcommand === 'list') {
      if (!guildDoc || !guildDoc.modules.customBlacklist?.patterns || guildDoc.modules.customBlacklist.patterns.length === 0) {
        return interaction.reply({ content: '📋 No custom blacklist patterns configured.', ephemeral: true });
      }

      const patterns = guildDoc.modules.customBlacklist.patterns.slice(0, 20);
      const embed = {
        title: 'Custom Blacklist Patterns',
        description: patterns.map((p, i) => `${i + 1}. \`${p}\``).join('\n'),
        footer: { text: `Total: ${guildDoc.modules.customBlacklist.patterns.length} patterns` },
      };

      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};