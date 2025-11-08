/**
 * Cloudflare Pages Functions - Update API Endpoint
 * Path: /functions/api/update/[sessionId].js
 * 
 * This handles POST requests to /api/update/:sessionId
 */

export async function onRequestPost(context) {
    const { request, params, env } = context;
    const sessionId = params.sessionId;

    // CORS headers
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };

    if (!sessionId) {
        return new Response(JSON.stringify({ error: 'Session ID required' }), {
            status: 400,
            headers: corsHeaders
        });
    }

    try {
        const data = await request.json();
        
        // Store data in KV with 24 hour expiration
        await env.OVERLAY_DATA.put(
            `session:${sessionId}`,
            JSON.stringify(data),
            { expirationTtl: 86400 } // 24 hours
        );

        return new Response(JSON.stringify({ success: true }), {
            headers: corsHeaders
        });
        
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: corsHeaders
        });
    }
}

// Handle OPTIONS preflight
export async function onRequestOptions() {
    return new Response(null, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
    });
}
