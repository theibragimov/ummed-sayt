const buckets = new Map()

// Returns true if allowed, false if rate limit exceeded.
// key: unique identifier (e.g. IP + endpoint)
// limit: max requests allowed in the window
// windowMs: window size in milliseconds
export function checkRateLimit(key, limit, windowMs) {
  const now = Date.now()
  const bucket = buckets.get(key)

  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }

  if (bucket.count >= limit) return false

  bucket.count++
  return true
}

// Hisoblagichni oshirmasdan faqat tekshiradi.
// Returns true if limit is already reached.
export function isRateLimited(key, limit) {
  const bucket = buckets.get(key)
  return !!bucket && bucket.resetAt >= Date.now() && bucket.count >= limit
}
