/**
 * Cloudflare Pages Functions - Overlay Display
 * Path: /functions/overlay/[sessionId]/[[player]].js
 * 
 * This handles GET requests to:
 * - /overlay/:sessionId (combined)
 * - /overlay/:sessionId/p1 (player 1 only)
 * - /overlay/:sessionId/p2 (player 2 only)
 */

export async function onRequestGet(context) {
    const { params } = context;
    const sessionId = params.sessionId;
    const player = params.player; // undefined, 'p1', or 'p2'

    // Build the redirect URL with proper path
    let redirectPath = `/index.html?session=${sessionId}`;
    if (player) {
        redirectPath += `&player=${player}`;
    }

    // Redirect to static page with query parameters
    return Response.redirect(new URL(redirectPath, context.request.url), 302);
}
