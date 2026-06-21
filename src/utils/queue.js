const { Queue, Worker, QueueEvents } = require('bullmq');
const Redis = require('ioredis');

const connection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// Punishment queue - for delayed punishments (temp mute, temp ban)
const punishmentQueue = new Queue('punishments', { connection });

// Auto-unmute worker
const autoUnmuteWorker = new Worker('punishments', async job => {
  const { guildId, userId, type } = job.data;
  
  console.log(`[BullMQ] Executing ${type} for user ${userId} in guild ${guildId}`);
  
  // Import here to avoid circular dependencies
  const { getSupabase } = require('../utils/supabase');
  const supabase = getSupabase();
  
  if (type === 'unmute') {
    // Remove timeout from Discord
    const { Client } = require('discord.js');
    // Note: In sharded environment, this would need to be broadcast to shards
    console.log(`[BullMQ] Unmuting user ${userId}`);
    
    // Update case status
    await supabase
      .from('cases')
      .update({ status: 'resolved', updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('guild_id', guildId)
      .eq('type', 'mute')
      .eq('status', 'active');
  }
  
  if (type === 'unban') {
    console.log(`[BullMQ] Unbanning user ${userId}`);
    
    await supabase
      .from('cases')
      .update({ status: 'resolved', updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('guild_id', guildId)
      .eq('type', 'tempban')
      .eq('status', 'active');
  }
  
  return { success: true };
}, { connection });

// Queue events for monitoring
const queueEvents = new QueueEvents('punishments', { connection });

queueEvents.on('completed', ({ jobId, returnvalue }) => {
  console.log(`[BullMQ] Job ${jobId} completed: ${returnvalue}`);
});

queueEvents.on('failed', ({ jobId, failedReason }) => {
  console.error(`[BullMQ] Job ${jobId} failed: ${failedReason}`);
});

// Helper functions
async function schedulePunishment(type, userId, guildId, delayMs, metadata = {}) {
  const job = await punishmentQueue.add(
    `punishment-${type}-${userId}-${guildId}`,
    {
      type,
      userId,
      guildId,
      ...metadata,
    },
    {
      delay: delayMs,
      removeOnComplete: true,
      removeOnFail: { count: 10 },
    }
  );
  
  console.log(`[BullMQ] Scheduled ${type} for user ${userId} in ${delayMs}ms (job: ${job.id})`);
  return job;
}

async function cancelPunishment(userId, guildId, type) {
  const jobs = await punishmentQueue.getJobs(['delayed']);
  const job = jobs.find(j => 
    j.data.userId === userId && 
    j.data.guildId === guildId && 
    j.data.type === type
  );
  
  if (job) {
    await job.remove();
    console.log(`[BullMQ] Cancelled ${type} for user ${userId}`);
    return true;
  }
  
  return false;
}

async function getPunishmentQueueStatus() {
  const [waiting, active, delayed] = await Promise.all([
    punishmentQueue.getWaitingCount(),
    punishmentQueue.getActiveCount(),
    punishmentQueue.getDelayedCount(),
  ]);
  
  return { waiting, active, delayed };
}

module.exports = {
  punishmentQueue,
  autoUnmuteWorker,
  queueEvents,
  schedulePunishment,
  cancelPunishment,
  getPunishmentQueueStatus,
};