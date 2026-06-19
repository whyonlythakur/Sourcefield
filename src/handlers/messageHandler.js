const modules = require('../modules');

async function handleMessageCreate(message, client) {
  if (message.author.bot || !message.guild) return;

  const guildDoc = await client.db.Guild.findOne({ guildId: message.guild.id });
  if (!guildDoc) return;

  for (const [modName, modConfig] of Object.entries(guildDoc.modules)) {
    if (!modConfig.enabled) continue;
    const mod = modules[modName];
    if (!mod || !mod.check) continue;

    try {
      const result = await mod.check(message, client.redis);
      if (result.triggered) {
        await client.reportHandler.createCase(message, modName, result);
        return;
      }
    } catch (err) {
      console.error(`[Module:${modName}] Error:`, err.message);
    }
  }
}

module.exports = { handleMessageCreate };
