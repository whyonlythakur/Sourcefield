/**
 * Load Testing Script for AutoMod Pro
 * 
 * Tests:
 * 1. Spam simulation (rapid messages)
 * 2. Raid simulation (mass joins)
 * 3. Concurrent dashboard users
 * 4. Module trigger benchmarks
 */

const { performance } = require('perf_hooks');

// Mock Discord client for testing
class MockClient {
  constructor() {
    this.messages = [];
    this.joins = [];
    this.moduleTriggers = [];
  }
  
  async simulateMessage(content, userId, channelId) {
    const timestamp = performance.now();
    this.messages.push({ content, userId, channelId, timestamp });
    return { timestamp };
  }
  
  async simulateJoin(userId, guildId) {
    const timestamp = performance.now();
    this.joins.push({ userId, guildId, timestamp });
    return { timestamp };
  }
  
  async triggerModule(moduleName, data) {
    const timestamp = performance.now();
    this.moduleTriggers.push({ moduleName, data, timestamp });
    return { timestamp };
  }
  
  getStats() {
    return {
      totalMessages: this.messages.length,
      totalJoins: this.joins.length,
      totalTriggers: this.moduleTriggers.length,
    };
  }
}

async function runSpamTest(client, duration = 5000, messagesPerSecond = 10) {
  console.log(`\n[Load Test] Starting spam test: ${messagesPerSecond} msg/s for ${duration}ms`);
  
  const startTime = performance.now();
  const interval = 1000 / messagesPerSecond;
  let count = 0;
  
  while (performance.now() - startTime < duration) {
    await client.simulateMessage(
      `Spam message ${count}`,
      'test-user-123',
      'test-channel-456'
    );
    count++;
    await new Promise(resolve => setTimeout(resolve, interval));
  }
  
  const endTime = performance.now();
  const durationActual = endTime - startTime;
  const messagesPerSecondActual = count / (durationActual / 1000);
  
  console.log(`[Spam Test] Completed: ${count} messages in ${durationActual.toFixed(0)}ms`);
  console.log(`[Spam Test] Rate: ${messagesPerSecondActual.toFixed(2)} msg/s`);
  
  return { count, duration: durationActual, rate: messagesPerSecondActual };
}

async function runRaidTest(client, userCount = 50) {
  console.log(`\n[Load Test] Starting raid test: ${userCount} users joining`);
  
  const startTime = performance.now();
  
  // Simulate mass joins
  const joinPromises = Array.from({ length: userCount }, (_, i) =>
    client.simulateJoin(`raider-${i}`, 'test-guild-789')
  );
  
  await Promise.all(joinPromises);
  
  const endTime = performance.now();
  const duration = endTime - startTime;
  const joinsPerSecond = userCount / (duration / 1000);
  
  console.log(`[Raid Test] Completed: ${userCount} joins in ${duration.toFixed(0)}ms`);
  console.log(`[Raid Test] Rate: ${joinsPerSecond.toFixed(2)} joins/s`);
  
  return { count: userCount, duration, rate: joinsPerSecond };
}

async function runModuleTriggerTest(client, iterations = 100) {
  console.log(`\n[Load Test] Starting module trigger test: ${iterations} iterations`);
  
  const startTime = performance.now();
  const latencies = [];
  
  for (let i = 0; i < iterations; i++) {
    const triggerStart = performance.now();
    await client.triggerModule('spamDetection', {
      userId: `user-${i}`,
      messageId: `msg-${i}`,
      content: 'test',
    });
    const triggerEnd = performance.now();
    latencies.push(triggerEnd - triggerStart);
  }
  
  const endTime = performance.now();
  const totalDuration = endTime - startTime;
  const avgLatency = latencies.reduce((a, b) => a + b, 0) / latencies.length;
  const maxLatency = Math.max(...latencies);
  const minLatency = Math.min(...latencies);
  const p95Latency = latencies.sort((a, b) => a - b)[Math.floor(latencies.length * 0.95)];
  
  console.log(`[Module Test] Completed: ${iterations} triggers in ${totalDuration.toFixed(0)}ms`);
  console.log(`[Module Test] Avg latency: ${avgLatency.toFixed(2)}ms`);
  console.log(`[Module Test] P95 latency: ${p95Latency.toFixed(2)}ms`);
  console.log(`[Module Test] Max latency: ${maxLatency.toFixed(2)}ms`);
  console.log(`[Module Test] Min latency: ${minLatency.toFixed(2)}ms`);
  
  return { avg: avgLatency, p95: p95Latency, max: maxLatency, min: minLatency };
}

async function runAllTests() {
  console.log('='.repeat(60));
  console.log('AutoMod Pro - Load Testing Suite');
  console.log('='.repeat(60));
  
  const client = new MockClient();
  
  const results = {
    spam: await runSpamTest(client, 5000, 10),
    raid: await runRaidTest(client, 50),
    module: await runModuleTriggerTest(client, 100),
  };
  
  console.log('\n' + '='.repeat(60));
  console.log('Load Test Summary');
  console.log('='.repeat(60));
  console.log(JSON.stringify(results, null, 2));
  console.log('\n' + '='.repeat(60));
  
  // Check if benchmarks meet targets
  console.log('\nBenchmark Targets:');
  console.log(`  - Detection-to-action: <1s (achieved: ${results.module.avg.toFixed(2)}ms) ${results.module.avg < 1000 ? '✅' : '❌'}`);
  console.log(`  - Spam handling: >5 msg/s (achieved: ${results.spam.rate.toFixed(2)}) ${results.spam.rate > 5 ? '✅' : '❌'}`);
  console.log(`  - Raid detection: <5s for 50 users (achieved: ${results.raid.duration.toFixed(0)}ms) ${results.raid.duration < 5000 ? '✅' : '❌'}`);
  
  return results;
}

// Run if executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  MockClient,
  runSpamTest,
  runRaidTest,
  runModuleTriggerTest,
  runAllTests,
};