const { Schema, model } = require('mongoose');

const moduleSchema = new Schema({
  enabled: { type: Boolean, default: false },
  threshold: { type: Number, default: 5 },
  ladder: { type: [String], default: ['warn', 'mute', 'kick', 'ban'] },
}, { _id: false });

const staffSchema = new Schema({
  userId: { type: String, required: true },
  role: { type: String, enum: ['admin', 'moderator', 'reporter'], default: 'moderator' },
}, { _id: false });

const securitySchema = new Schema({
  level: { type: String, enum: ['low', 'moderate', 'high'], default: 'low' },
  autoEscalateOnRaid: { type: Boolean, default: false },
  mediaChannelId: { type: String, default: null },
  reviewChannelId: { type: String, default: null },
  trustedRoleId: { type: String, default: null },
  webhookId: { type: String, default: null },
}, { _id: false });

const guildSchema = new Schema({
  guildId: { type: String, required: true, unique: true },
  prefix: { type: String, default: '!' },
  ownerOverrides: { type: [String], default: [] },
  staff: { type: [staffSchema], default: [] },
  modules: {
    spam: { type: moduleSchema, default: () => ({ enabled: true, threshold: 5 }) },
    duplicate: { type: moduleSchema, default: () => ({}) },
    massMention: { type: moduleSchema, default: () => ({ enabled: true, threshold: 5 }) },
    massEmoji: { type: moduleSchema, default: () => ({}) },
    capsLock: { type: moduleSchema, default: () => ({}) },
    profanity: { type: moduleSchema, default: () => ({ enabled: true, threshold: 3 }) },
    customBlacklist: { type: moduleSchema, default: () => ({}) },
    inviteFilter: { type: moduleSchema, default: () => ({ enabled: true }) },
    externalLinks: { type: moduleSchema, default: () => ({ enabled: true }) },
    phishingLinks: { type: moduleSchema, default: () => ({}) },
    nsfwImage: { type: moduleSchema, default: () => ({}) },
    zalgoFilter: { type: moduleSchema, default: () => ({}) },
    antiRaid: { type: moduleSchema, default: () => ({ enabled: true, threshold: 5 }) },
    newAccount: { type: moduleSchema, default: () => ({}) },
    altDetection: { type: moduleSchema, default: () => ({}) },
    webhookSpam: { type: moduleSchema, default: () => ({}) },
    nicknameFilter: { type: moduleSchema, default: () => ({}) },
    channelRoleSpam: { type: moduleSchema, default: () => ({}) },
    autoSlowmode: { type: moduleSchema, default: () => ({}) },
    tokenIpGrabber: { type: moduleSchema, default: () => ({}) },
    selfbotDetection: { type: moduleSchema, default: () => ({}) },
    warnSystem: { type: moduleSchema, default: () => ({ enabled: true }) },
    muteManager: { type: moduleSchema, default: () => ({ enabled: true }) },
    lockdown: { type: moduleSchema, default: () => ({}) },
    verificationGate: { type: moduleSchema, default: () => ({}) },
    mediaSecurity: { type: moduleSchema, default: () => ({}) },
  },
  logChannels: {
    modActions: { type: String, default: null },
    automodTriggers: { type: String, default: null },
    messageLogs: { type: String, default: null },
    memberLogs: { type: String, default: null },
    raidLogs: { type: String, default: null },
    caseLogs: { type: String, default: null },
    serverLogs: { type: String, default: null },
    errorLogs: { type: String, default: null },
  },
  verification: {
    enabled: { type: Boolean, default: false },
    type: { type: String, enum: ['captcha', 'reaction'], default: 'reaction' },
    gateRoleId: { type: String, default: null },
  },
  security: { type: securitySchema, default: () => ({}) },
}, { timestamps: true });

module.exports = model('Guild', guildSchema);
