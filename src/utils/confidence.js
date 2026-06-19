function calculateConfidence(triggeredRules, totalRules, matchAccuracy) {
  const ruleWeight = triggeredRules / Math.max(totalRules, 1);
  return Math.min(Math.round((ruleWeight * 0.6 + matchAccuracy * 0.4) * 100), 100);
}

function shouldAutoResolve(confidenceScore, severity) {
  return confidenceScore >= 90 && severity === 'low';
}

module.exports = { calculateConfidence, shouldAutoResolve };
