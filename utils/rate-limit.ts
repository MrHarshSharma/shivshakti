/**
 * Fixed-window rate limiting, held in memory.
 *
 * Scope and limits, stated plainly:
 *  - State lives in the Node process, so it resets on deploy or restart, and each
 *    instance counts separately. The app runs as a single standalone server on
 *    Hostinger, so that is adequate today; behind more than one instance this stops
 *    being a real limit and should move to Postgres or Redis.
 *  - IPs are held only for the length of the window and never written to the database.
 *    A rate limiter does not need a permanent record of who visited.
 */

/** Submissions allowed per IP per window. */
export const FEEDBACK_MAX = 10
/** One hour. */
export const FEEDBACK_WINDOW_MS = 60 * 60 * 1000

export interface RateLimitResult {
    allowed: boolean
    remaining: number
    retryAfterSeconds: number
}

const buckets = new Map<string, number[]>()
let lastSweep = 0

/** Drops expired buckets so a long-running process doesn't grow a map of every IP seen. */
function sweep(now: number, windowMs: number) {
    if (now - lastSweep < windowMs) return
    lastSweep = now
    for (const [key, times] of buckets) {
        const kept = times.filter(t => now - t < windowMs)
        if (kept.length > 0) buckets.set(key, kept)
        else buckets.delete(key)
    }
}

export function rateLimit(key: string, max: number, windowMs: number): RateLimitResult {
    const now = Date.now()
    sweep(now, windowMs)

    const times = (buckets.get(key) || []).filter(t => now - t < windowMs)

    if (times.length >= max) {
        // Oldest hit in the window decides when a slot frees up.
        const retryAfterSeconds = Math.max(1, Math.ceil((windowMs - (now - times[0])) / 1000))
        buckets.set(key, times)
        return { allowed: false, remaining: 0, retryAfterSeconds }
    }

    times.push(now)
    buckets.set(key, times)
    return { allowed: true, remaining: max - times.length, retryAfterSeconds: 0 }
}

/**
 * Best-effort client IP. Behind Hostinger's proxy the real address is the first entry
 * in x-forwarded-for; the rest of that header is proxy hops and cannot be trusted.
 *
 * A determined attacker can rotate IPs, so this raises the cost of flooding rather than
 * preventing it. The approval gate is what keeps junk off the storefront.
 */
export function clientIp(request: Request): string {
    const forwarded = request.headers.get('x-forwarded-for')
    if (forwarded) {
        const first = forwarded.split(',')[0].trim()
        if (first) return first
    }
    return request.headers.get('x-real-ip')?.trim() || 'unknown'
}
