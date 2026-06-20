function calculateConfidence(triggeredRules, totalRules, matchAccuracy) {
  const ruleWeight = triggeredRules / Math.max(totalRules, 1);
  return Math.min(Math.round((ruleWeight * 0.6 + matchAccuracy * 0.4) * 100), 100);
}

function shouldAutoResolve(confidenceScore, severity) {
  return confidenceScore >= 90 && severity === 'low';
}

function calculateSeverity(confidence, violationType) {
  if (violationType === 'critical') return 'critical';
  if (confidence >= 95) return 'high';
  if (confidence >= 80) return 'medium';
  return 'low';
}

function getAutoActionThreshold(moduleName) {
  const thresholds = {
    spam: 90,
    massMention: 95,
    profanity: 85,
    inviteFilter: 95,
    externalLinks: 90,
    phishingLinks: 95,
    nsfwImage: 90,
    zalgoFilter: 80,
    antiRaid: 95,
    newAccount: 90,
    altDetection: 85,
    webhookSpam: 90,
    nicknameFilter: 85,
    channelRoleSpam: 90,
    autoSlowmode: 80,
    tokenIpGrabber: 98,
    selfbotDetection: 90,
    duplicate: 85,
    massEmoji: 80,
    capsLock: 75,
    customBlacklist: 95,
  };

  return thresholds[moduleName] || 90;
}

function shouldAutoPunish(confidenceScore, moduleName, severity) {
  const threshold = getAutoActionThreshold(moduleName);
  return confidenceScore >= threshold && severity !== 'critical';
}

module.exports = {
  calculateConfidence,
  shouldAutoResolve,
  calculateSeverity,
  getAutoActionThreshold,
  shouldAutoPunish,
};