const { handleMemberAdd } = require('../handlers/memberHandler');

module.exports = {
  name: 'guildMemberAdd',
  async execute(member, client) {
    await handleMemberAdd(member, client);
  },
};
