const { handleReviewInteraction } = require('../handlers/reviewHandler');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    if (interaction.isButton()) {
      await handleReviewInteraction(interaction, client);
    }
  },
};