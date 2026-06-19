let counter = 0;

function generateCaseId() {
  counter++;
  const timestamp = Date.now().toString(36).toUpperCase();
  const count = counter.toString(36).toUpperCase().padStart(4, '0');
  return `AMP-${timestamp}-${count}`;
}

module.exports = { generateCaseId };
