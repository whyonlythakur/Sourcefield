require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

const commands = [];
const commandDirs = [
  path.join(__dirname, '..', 'src', 'commands', 'moderation'),
  path.join(__dirname, '..', 'src', 'commands', 'config'),
  path.join(__dirname, '..', 'src', 'commands', 'security'),
];

for (const dir of commandDirs) {
  if (!fs.existsSync(dir)) continue;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));
  for (const file of files) {
    const command = require(path.join(dir, file));
    if (command.data) commands.push(command.data.toJSON());
  }
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log(`[Deploy] Registering ${commands.length} commands...`);
    const data = await rest.put(
      Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
      { body: commands },
    );
    console.log(`[Deploy] Successfully registered ${data.length} application commands`);
  } catch (err) {
    console.error('[Deploy] Failed:', err);
  }
})();
