const fs = require('fs');
const path = require('path');

function loadEvents(client) {
  const eventsDir = __dirname;
  const files = fs.readdirSync(eventsDir).filter(f => f.endsWith('.js') && f !== 'index.js');

  for (const file of files) {
    const event = require(path.join(eventsDir, file));
    if (event.name) {
      if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
      } else {
        client.on(event.name, (...args) => event.execute(...args, client));
      }
    }
  }
  console.log(`[Events] Loaded ${files.length} event handlers`);
}

module.exports = { loadEvents };
