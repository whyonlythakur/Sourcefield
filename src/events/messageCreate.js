const { handleMessageCreate } = require('../handlers/messageHandler');

module.exports = {
  name: 'messageCreate',
  async execute(message, client) {
    await handleMessageCreate(message, client);
  },
};
