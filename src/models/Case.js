const { Schema, model } = require('mongoose');

const caseSchema = new Schema({
  caseId: { type: String, required: true, unique: true },
  guildId: { type: String, required: true, index: true },
  type: { type: String, enum: ['auto', 'manual'], required: true },
  module: { type: String, default: null },
  severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
  targetUserId: { type: String, required: true, index: true },
  reporterId: { type: String, default: null },
  reviewerId: { type: String, default: null },
  evidence: {
    content: { type: String, default: null },
    attachments: { type: [String], default: [] },
    confidenceScore: { type: Number, default: 0 },
  },
  status: {
    type: String,
    enum: ['pending', 'in_review', 'resolved', 'dismissed', 'escalated'],
    default: 'pending',
    index: true,
  },
  punishment: { type: String, enum: ['none', 'warn', 'mute', 'kick', 'ban'], default: 'none' },
  resolvedAt: { type: Date, default: null },
}, { timestamps: true });

module.exports = model('Case', caseSchema);
