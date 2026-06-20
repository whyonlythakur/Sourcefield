const modules = require('../modules');
const { handleModuleTrigger } = require('./actionHandler');
const { sendLog } = require('./logHandler');

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
        if (modName === 'warnSystem') {
          await handleModuleTrigger(client, message, modName, result);
        } else {
          await handleModuleTrigger(client, message, modName, result);
          await sendLog(client, message.guild.id, 'automodTriggers', {
            title: `${modName} Triggered`,
            description: `User: <@${message.author.id}> | Channel: <#${message.channel.id}>`,
            fields: [
              { name: 'Confidence', value: `${result.confidence}%`, inline: true },
              { name: 'Severity', value: result.severity || 'medium', inline: true },
            ],
          });
        }
        return;
      }
    } catch (err) {
      console.error(`[Module:${modName}] Error:`, err.message);
    }
  }
}

module.exports = { handleMessageCreate };