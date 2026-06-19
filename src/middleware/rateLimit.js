const rateLimitMap = new Map();

function rateLimit(key, maxRequests = 10, windowMs = 60000) {
  const now = Date.now();
  const entry = rateLimitMap.get(key) || { count: 0, resetAt: now + windowMs };

  if (now > entry.resetAt) {
    entry.count = 1;
    entry.resetAt = now + windowMs;
  } else {
    entry.count++;
  }

  rateLimitMap.set(key, entry);
  return entry.count <= maxRequests;
}

module.exports = { rateLimit };
