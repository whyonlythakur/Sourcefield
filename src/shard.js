require('dotenv').config();
const { ShardingManager } = require('discord.js');
const path = require('path');

async function main() {
  try {
    console.log('[Shard] Starting ShardingManager...');
    
    const manager = new ShardingManager(path.join(__dirname, 'bot.js'), {
      token: process.env.DISCORD_TOKEN,
      totalShards: 'auto', // Auto-calculate based on guild count
      shardList: 'auto',
      mode: 'process',
      respawn: true,
      timeout: 60000,
    });

    manager.on('shardCreate', shard => {
      console.log(`[Shard] Launched shard ${shard.id}`);
      
      shard.on('ready', () => {
        console.log(`[Shard ${shard.id}] Ready`);
      });
      
      shard.on('death', () => {
        console.log(`[Shard ${shard.id}] Process exited, respawning...`);
      });
      
      shard.on('disconnect', () => {
        console.log(`[Shard ${shard.id}] Disconnected`);
      });
      
      shard.on('reconnecting', () => {
        console.log(`[Shard ${shard.id}] Reconnecting`);
      });
    });

    await manager.spawn();
    
    console.log(`[Shard] Successfully spawned ${manager.shards.size} shard(s)`);
    
    // Graceful shutdown
    process.on('SIGINT', async () => {
      console.log('[Shard] Received SIGINT, shutting down gracefully...');
      await manager.broadcastEval(async client => {
        await client.destroy();
      });
      process.exit(0);
    });
    
    process.on('SIGTERM', async () => {
      console.log('[Shard] Received SIGTERM, shutting down gracefully...');
      await manager.broadcastEval(async client => {
        await client.destroy();
      });
      process.exit(0);
    });
    
  } catch (err) {
    console.error('[FATAL] Shard manager failed:', err);
    process.exit(1);
  }
}

main();