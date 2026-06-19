const { Collection, REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

function loadCommands(client) {
  client.commands = new Collection();
  const commandDirs = ['moderation', 'config', 'security'];
  const commandsArray = [];

  for (const dir of commandDirs) {
    const dirPath = path.join(__dirname, dir);
    if (!fs.existsSync(dirPath)) continue;
    const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.js'));
    for (const file of files) {
      const command = require(path.join(dirPath, file));
      if (command.data && command.execute) {
        client.commands.set(command.data.name, command);
        commandsArray.push(command.data.toJSON());
      }
    }
  }

  client.once('ready', () => {
    const rest = new REST({ version: '10' }).setToken(client.token);
    rest.put(Routes.applicationCommands(client.user.id), { body: commandsArray })
      .then(() => console.log('[Commands] Registered', commandsArray.length, 'slash commands'))
      .catch(console.error);
  });
}

module.exports = { loadCommands };
