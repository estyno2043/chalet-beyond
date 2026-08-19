/*
 * In-memory sliding-window limiter.
 *
 * Netlify reuses a warm function instance across requests, so this throttles a
 * flood from one source — but it is per-instance, not global: it slows abuse,
 * it does not make the endpoint safe on its own. Paired with the honeypot in
 * inquiry.ts it stops scripted floods; a distributed attacker would need a
 * shared store (Netlify Blobs) or a CAPTCHA to stop properly.
 */

const hits = new Map<string, number[]>();

/** Records an attempt and reports whether `key` has exceeded `limit` in `windowMs`. */
export function exceedsLimit(
  key: string,
  limit: number,
  windowMs: number,
  now = Date.now(),
): boolean {
  const cutoff = now - windowMs;
  const recent = (hits.get(key) ?? []).filter((at) => at > cutoff);
  recent.push(now);
  hits.set(key, recent);

  // Drop keys whose window has fully elapsed, so a long-lived instance does not
  // accumulate an entry per attacker IP forever.
  // Array.from rather than iterating the Map directly: tsconfig sets no
  // `target`, so tsc assumes ES5 and rejects it.
  if (hits.size > 500) {
    for (const [key, times] of Array.from(hits.entries())) {
      if (times.every((at) => at <= cutoff)) hits.delete(key);
    }
  }

  return recent.length > limit;
}

/** Test seam: clears all recorded attempts. */
export function resetLimits(): void {
  hits.clear();
}
