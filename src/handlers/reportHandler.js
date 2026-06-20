const Case = require('../models/Case');
const User = require('../models/User');
const MediaCase = require('../models/MediaCase');
const { generateCaseId } = require('../utils/caseId');
const { shouldAutoResolve } = require('../utils/confidence');
const { handleModuleTrigger } = require('./actionHandler');
const { sendLog } = require('./logHandler');

async function createCase(client, message, moduleName, result) {
  const autoResolve = shouldAutoResolve(result.confidence, result.severity);
  
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
    status: autoResolve ? 'resolved' : 'pending',
    punishment: 'none',
    resolvedAt: autoResolve ? new Date() : null,
  });

  if (autoResolve) {
    await handleModuleTrigger(client, message, moduleName, result);
    await sendLog(client, message.guild.id, 'caseLogs', {
      title: `Case ${caseDoc.caseId} Auto-Resolved`,
      description: `High confidence (${result.confidence}%) + low severity = instant action`,
      fields: [
        { name: 'Module', value: moduleName, inline: true },
        { name: 'Target', value: `<@${message.author.id}>`, inline: true },
        { name: 'Punishment', value: 'Executed per ladder', inline: true },
      ],
    });
  } else {
    await sendLog(client, message.guild.id, 'caseLogs', {
      title: `Case ${caseDoc.caseId} Created`,
      description: 'Pending manual review',
      fields: [
        { name: 'Module', value: moduleName, inline: true },
        { name: 'Target', value: `<@${message.author.id}>`, inline: true },
        { name: 'Confidence', value: `${result.confidence}%`, inline: true },
      ],
    });
  }

  return caseDoc;
}

async function createManualReport(client, guildId, targetUserId, reporterId, reason, evidence = {}) {
  const caseDoc = await Case.create({
    caseId: generateCaseId(),
    guildId,
    type: 'manual',
    module: 'report',
    severity: 'medium',
    targetUserId,
    reporterId,
    evidence: {
      content: reason,
      attachments: evidence.attachments || [],
      confidenceScore: 0,
    },
    status: 'pending',
    punishment: 'none',
  });

  await sendLog(client, guildId, 'caseLogs', {
    title: `Case ${caseDoc.caseId} Created (Manual Report)`,
    description: 'User-submitted report requires review',
    fields: [
      { name: 'Reporter', value: `<@${reporterId}>`, inline: true },
      { name: 'Target', value: `<@${targetUserId}>`, inline: true },
      { name: 'Reason', value: reason.substring(0, 100), inline: false },
    ],
  });

  return caseDoc;
}

async function createMediaCase(client, message, securityLevel) {
  const attachments = message.attachments
    .filter(a => a.contentType?.startsWith('image/') || a.contentType?.startsWith('video/'))
    .map(a => ({
      url: a.url,
      type: a.contentType?.startsWith('video/') ? 'video' : 'image',
      hash: null,
    }));

  const mediaCase = await MediaCase.create({
    caseId: generateCaseId(),
    guildId: message.guild.id,
    uploaderId: message.author.id,
    attachments,
    securityLevelAtUpload: securityLevel,
    status: 'pending',
  });

  await sendLog(client, message.guild.id, 'caseLogs', {
    title: `Media Case ${mediaCase.caseId} Created`,
    description: 'Media intercepted for review',
    fields: [
      { name: 'Uploader', value: `<@${message.author.id}>`, inline: true },
      { name: 'Security Level', value: securityLevel.toUpperCase(), inline: true },
      { name: 'Attachments', value: `${attachments.length}`, inline: true },
    ],
  });

  return mediaCase;
}

async function updateCaseStatus(caseId, status, reviewerId = null, additionalData = {}) {
  const updateData = {
    status,
    reviewerId,
    ...(additionalData.punishment && { punishment: additionalData.punishment }),
    ...(additionalData.rejectionReason && { rejectionReason: additionalData.rejectionReason }),
    resolvedAt: status !== 'pending' && status !== 'in_review' ? new Date() : null,
  };

  const updated = await Case.findOneAndUpdate({ caseId }, updateData, { new: true });
  return updated;
}

module.exports = {
  createCase,
  createManualReport,
  createMediaCase,
  updateCaseStatus,
};