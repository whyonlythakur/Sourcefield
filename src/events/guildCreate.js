const Guild = require('../models/Guild');

module.exports = {
  name: 'guildCreate',
  async execute(guild, client) {
    try {
      await Guild.findOneAndUpdate(
        { guildId: guild.id },
        { guildId: guild.id, ownerOverrides: [guild.ownerId] },
        { upsert: true, new: true },
      );
      console.log(`[Guild] Joined "${guild.name}" (${guild.id}), created Guild doc`);
    } catch (err) {
      console.error(`[Guild] Error creating doc for ${guild.id}:`, err.message);
    }
  },
};