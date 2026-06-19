const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  userId: { type: String, required: true },
  guildId: { type: String, required: true, index: true },
  warnPoints: { type: Number, default: 0 },
  history: { type: [String], default: [] },
  flags: {
    isAltSuspect: { type: Boolean, default: false },
    accountAgeAtJoin: { type: Number, default: null },
  },
}, { timestamps: true });

userSchema.index({ userId: 1, guildId: 1 }, { unique: true });

module.exports = model('User', userSchema);
