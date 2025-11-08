/**
 * Cloudflare Pages Functions - API Endpoint
 * Path: /functions/api/data/[sessionId].js
 * 
 * This handles GET requests to /api/data/:sessionId
 */

export async function onRequestGet(context) {
    const { params, env } = context;
    const sessionId = params.sessionId;

    // CORS headers
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
    };

    if (!sessionId) {
        return new Response(JSON.stringify({ error: 'Session ID required' }), {
            status: 400,
            headers: corsHeaders
        });
    }

    try {
        // Get data from KV
        const dataStr = await env.OVERLAY_DATA.get(`session:${sessionId}`);
        
        if (!dataStr) {
            // Return default data if not found
            const defaultData = {
                mode: 'single',
                maxWins: 2,
                players: {
                    p1: { wins: 0, name: 'P1', showName: true },
                    p2: { wins: 0, name: 'P2', showName: true }
                },
                settings: {
                    font: 'MrBeast',
                    fontSize: 120,
                    fontColor: '#FFFFFF',
                    borderEnabled: true,
                    borderColor: '#000000',
                    borderSize: 4
                },
                playerSettings: { p1: {}, p2: {} }
            };
            
            return new Response(JSON.stringify(defaultData), { headers: corsHeaders });
        }

        const data = JSON.parse(dataStr);
        return new Response(JSON.stringify(data), { headers: corsHeaders });
        
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
