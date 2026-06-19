module.exports = {
  name: 'guildDelete',
  async execute(guild, client) {
    try {
      await client.db.Guild.deleteOne({ guildId: guild.id });
      console.log(`[Guild] Left "${guild.name}" (${guild.id}), deleted Guild doc`);
    } catch (err) {
      console.error(`[Guild] Error deleting doc for ${guild.id}:`, err.message);
    }
  },
};