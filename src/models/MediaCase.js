const { Schema, model } = require('mongoose');

const attachmentSchema = new Schema({
  url: { type: String, required: true },
  type: { type: String, enum: ['image', 'video', 'gif'], required: true },
  hash: { type: String, default: null },
}, { _id: false });

const mediaCaseSchema = new Schema({
  caseId: { type: String, required: true, unique: true },
  guildId: { type: String, required: true, index: true },
  uploaderId: { type: String, required: true },
  attachments: { type: [attachmentSchema], default: [] },
  securityLevelAtUpload: { type: String, enum: ['low', 'moderate', 'high'], required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending', index: true },
  reviewerId: { type: String, default: null },
  rejectionReason: { type: String, default: null },
  relayedMessageId: { type: String, default: null },
}, { timestamps: true });

module.exports = model('MediaCase', mediaCaseSchema);
