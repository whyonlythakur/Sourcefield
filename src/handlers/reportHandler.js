const Case = require('../models/Case');
const { generateCaseId } = require('../utils/caseId');

async function createCase(message, moduleName, result) {
  const caseDoc = await Case.create({
    caseId: generateCaseId(),
    guildId: message.guild.id,
    type: 'auto',
    module: moduleName,
    severity: result.severity || 'medium',
    targetUserId: message.author.id,
    evidence: {
      content: message.content,
      attachments: message.attachments.map(a => a.url),
      confidenceScore: result.confidence,
    },
    status: result.confidence >= 90 && result.severity === 'low' ? 'resolved' : 'pending',
    punishment: 'none',
  });

  return caseDoc;
}

async function createManualReport(guildId, targetUserId, reporterId, reason) {
  const caseDoc = await Case.create({
    caseId: generateCaseId(),
    guildId,
    type: 'manual',
    targetUserId,
    reporterId,
    evidence: { content: reason, confidenceScore: 0 },
    status: 'pending',
    punishment: 'none',
  });

  return caseDoc;
}

module.exports = { createCase, createManualReport };
