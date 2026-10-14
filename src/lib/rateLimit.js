// Rate limiter in-memory: protegge dai burst sulla stessa istanza. Su hosting serverless
// (Vercel) ogni istanza ha il suo contatore: il limite vero va impostato nel Firewall
// della piattaforma (vedi README, sezione Sicurezza).

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

  // Pulizia periodica per evitare memory leak, con un tetto massimo di voci
  if (store.size > 2000) {
    for (const [key, val] of store) {
      if (now > val.resetAt) store.delete(key);
    }
    while (store.size > 4000) store.delete(store.keys().next().value);
  }

  return { ok: entry.count <= limit, remaining: Math.max(0, limit - entry.count) };
}
