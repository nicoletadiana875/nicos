// Rate limiter in-memory. In produzione su Vercel (serverless) usare Redis/Upstash
// per persistenza tra invocazioni. Qui protegge da burst sullo stesso nodo.

const store = new Map();

/**
 * @param {string} ip
 * @param {number} limit  – richieste massime nella finestra
 * @param {number} windowMs – finestra in millisecondi
 * @returns {{ ok: boolean, remaining: number }}
 */
export function rateLimit(ip, limit = 30, windowMs = 60_000) {
  const now = Date.now();
  let entry = store.get(ip);

  if (!entry || now > entry.resetAt) {
    entry = { count: 0, resetAt: now + windowMs };
  }

  entry.count += 1;
  store.set(ip, entry);

  // Pulizia periodica per evitare memory leak
  if (store.size > 2000) {
    for (const [key, val] of store) {
      if (now > val.resetAt) store.delete(key);
    }
  }

  return { ok: entry.count <= limit, remaining: Math.max(0, limit - entry.count) };
}
