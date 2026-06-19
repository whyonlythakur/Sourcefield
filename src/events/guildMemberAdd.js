const { handleMemberAdd } = require('../handlers/memberHandler');

module.exports = {
  name: 'guildMemberAdd',
  async execute(member, client) {
    const key = `raid:${member.guild.id}`;
    const now = Date.now();

    await client.redis.zadd(key, now, `${member.id}-${now}`);
    await client.redis.expire(key, 60);

    await handleMemberAdd(member, client);
  },
};