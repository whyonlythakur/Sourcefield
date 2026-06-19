const { EmbedBuilder } = require('discord.js');
const { buildLogEmbed } = require('../utils/embeds');

const LOG_CATEGORIES = [
  'modActions',
  'automodTriggers',
  'messageLogs',
  'memberLogs',
  'raidLogs',
  'caseLogs',
  'serverLogs',
  'errorLogs',
];

async function sendLog(client, guildId, category, data) {
  const guildDoc = await client.db.Guild.findOne({ guildId });
  if (!guildDoc) return;

  const channelId = guildDoc.logChannels[category];
  if (!channelId) return;

  const channel = client.channels.cache.get(channelId);
  if (!channel) return;

  const embed = buildLogEmbed(category, data);
  await channel.send({ embeds: [embed] }).catch(() => {});
}

module.exports = { sendLog, LOG_CATEGORIES };
