module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`[Bot] Ready! Logged in as ${client.user.tag}`);
    client.user.setActivity('AutoMod Pro | /help');
  },
};
