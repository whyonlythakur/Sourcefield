const rateLimit = new Map();

/**
 * Rate limiting middleware for API routes
 * @param {string} identifier - User ID or IP
 * @param {number} limit - Max requests per window
 * @param {number} windowMs - Time window in milliseconds
 * @returns {boolean} - True if allowed, false if rate limited
 */
function checkRateLimit(identifier, limit = 100, windowMs = 60000) {
  const now = Date.now();
  const userLimit = rateLimit.get(identifier) || { count: 0, resetAt: now + windowMs };
  
  if (now > userLimit.resetAt) {
    userLimit.count = 1;
    userLimit.resetAt = now + windowMs;
  } else {
    userLimit.count++;
  }
  
  rateLimit.set(identifier, userLimit);
  
  return userLimit.count <= limit;
}

/**
 * Clean up old rate limit entries (run every 5 minutes)
 */
function cleanupRateLimits() {
  const now = Date.now();
  for (const [key, value] of rateLimit.entries()) {
    if (now > value.resetAt) {
      rateLimit.delete(key);
    }
  }
}

setInterval(cleanupRateLimits, 5 * 60 * 1000);

/**
 * Encrypt OAuth2 token (simple XOR + base64 for at-rest encryption)
 * In production, use proper encryption like AES-256-GCM
 */
function encryptToken(token, secret) {
  const xor = token.split('').map((char, i) => 
    String.fromCharCode(char.charCodeAt(0) ^ secret.charCodeAt(i % secret.length))
  ).join('');
  return Buffer.from(xor).toString('base64');
}

/**
 * Decrypt OAuth2 token
 */
function decryptToken(encrypted, secret) {
  const xor = Buffer.from(encrypted, 'base64').toString('utf-8')
    .split('')
    .map((char, i) => 
      String.fromCharCode(char.charCodeAt(0) ^ secret.charCodeAt(i % secret.length))
    )
    .join('');
  return xor;
}

/**
 * Validate user has required role/permission for dashboard action
 */
function validateUserPermission(user, guild, requiredRole) {
  const roleHierarchy = {
    reporter: 1,
    mod: 2,
    admin: 3,
    owner: 4,
  };
  
  const userRole = user.role || 'reporter';
  const userLevel = roleHierarchy[userRole] || 0;
  const requiredLevel = roleHierarchy[requiredRole] || 0;
  
  return userLevel >= requiredLevel;
}

/**
 * Sanitize user input to prevent XSS
 */
function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  return input
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/'/g, ''')
    .replace(/\//g, '&#x2F;');
}

module.exports = {
  checkRateLimit,
  cleanupRateLimits,
  encryptToken,
  decryptToken,
  validateUserPermission,
  sanitizeInput,
};