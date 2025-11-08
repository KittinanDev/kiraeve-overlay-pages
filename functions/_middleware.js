// Cloudflare Pages Functions Middleware
// Create in-memory session storage (faster than KV, no rate limits)

const sessionStore = new Map();
const SESSION_TTL = 86400000; // 24 hours in ms

export async function onRequest(context) {
    // Attach session store to context
    context.env.sessionStore = sessionStore;
    
    // Cleanup old sessions periodically
    if (Math.random() < 0.01) { // 1% chance per request
        const now = Date.now();
        for (const [key, value] of sessionStore.entries()) {
            if (value.expires < now) {
                sessionStore.delete(key);
            }
        }
    }
    
    return await context.next();
}
