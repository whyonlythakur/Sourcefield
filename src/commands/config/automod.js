const { SlashCommandBuilder } = require('discord.js');
const Guild = require('../../models/Guild');
const { TIERS, getTier } = require('../../middleware/permissions');

const MODULE_NAMES = [
  'spam', 'duplicate', 'massMention', 'massEmoji', 'capsLock', 'profanity',
  'customBlacklist', 'inviteFilter', 'externalLinks', 'phishingLinks', 'nsfwImage',
  'zalgoFilter', 'antiRaid', 'newAccount', 'altDetection', 'webhookSpam',
  'nicknameFilter', 'channelRoleSpam', 'autoSlowmode', 'tokenIpGrabber',
  'selfbotDetection', 'warnSystem', 'muteManager', 'lockdown', 'verificationGate', 'mediaSecurity',
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('automod')
    .setDescription('Configure automod modules')
    .addSubcommand(sc => sc.setName('module').setDescription('Enable/disable a module')
      .addStringOption(o => o.setName('name').setDescription('Module name').setRequired(true).setAutocomplete(true))
      .addStringOption(o => o.setName('action').setDescription('Enable or disable').setRequired(true).addChoices(
        { name: 'Enable', value: 'enable' },
        { name: 'Disable', value: 'disable' },
      )))
    .addSubcommand(sc => sc.setName('threshold').setDescription('Adjust module sensitivity')
      .addStringOption(o => o.setName('name').setDescription('Module name').setRequired(true).setAutocomplete(true))
      .addIntegerOption(o => o.setName('value').setDescription('Threshold value').setRequired(true)))
    .addSubcommand(sc => sc.setName('punishment').setDescription('Set punishment ladder for a module')
      .addStringOption(o => o.setName('name').setDescription('Module name').setRequired(true).setAutocomplete(true))
      .addStringOption(o => o.setName('ladder').setDescription('Comma-separated ladder: warn,mute,kick,ban').setRequired(true))),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const guildDoc = await Guild.findOne({ guildId: interaction.guildId });

    if (getTier(interaction.member, guildDoc) < TIERS.BOT_ADMIN) {
      return interaction.reply({ content: '❌ Only Bot Admins can configure automod.', ephemeral: true });
    }

    if (subcommand === 'module') {
      const moduleName = interaction.options.getString('name', true);
      const action = interaction.options.getString('action', true);

      if (!MODULE_NAMES.includes(moduleName)) {
        return interaction.reply({ content: `❌ Unknown module: ${moduleName}`, ephemeral: true });
      }

      if (!guildDoc) {
        await Guild.create({ guildId: interaction.guildId });
      }

      guildDoc.modules[moduleName].enabled = action === 'enable';
      await guildDoc.save();

      return interaction.reply({ content: `✅ Module **${moduleName}** ${action}d`, ephemeral: false });
    }

    if (subcommand === 'threshold') {
      const moduleName = interaction.options.getString('name', true);
      const value = interaction.options.getInteger('value', true);

      if (!MODULE_NAMES.includes(moduleName)) {
        return interaction.reply({ content: `❌ Unknown module: ${moduleName}`, ephemeral: true });
      }

      if (!guildDoc) {
        await Guild.create({ guildId: interaction.guildId });
      }

      guildDoc.modules[moduleName].threshold = value;
      await guildDoc.save();

      return interaction.reply({ content: `✅ Module **${moduleName}** threshold set to **${value}**`, ephemeral: false });
    }

    if (subcommand === 'punishment') {
      const moduleName = interaction.options.getString('name', true);
      const ladderStr = interaction.options.getString('ladder', true);

      if (!MODULE_NAMES.includes(moduleName)) {
        return interaction.reply({ content: `❌ Unknown module: ${moduleName}`, ephemeral: true });
      }

      const ladder = ladderStr.split(',').map(s => s.trim().toLowerCase()).filter(s => ['warn', 'mute', 'kick', 'ban'].includes(s));
      if (ladder.length === 0) {
        return interaction.reply({ content: '❌ Invalid ladder. Use: warn,mute,kick,b an (comma-separated)', ephemeral: true });
      }

      if (!guildDoc) {
        await Guild.create({ guildId: interaction.guildId });
      }

      guildDoc.modules[moduleName].ladder = ladder;
      await guildDoc.save();

      return interaction.reply({ content: `✅ Module **${moduleName}** punishment ladder: **${ladder.join(' → ')}**`, ephemeral: false });
    }

    return interaction.reply({ content: 'Unknown subcommand', ephemeral: true });
  },
};