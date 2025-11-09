/**
 * Cloudflare Pages Functions - API Endpoint
 * Path: /functions/api/data.js
 * 
 * This handles GET requests to /api/data (no sessionId required)
 * Matches localhost /api/data functionality exactly
 */

export async function onRequestGet(context) {
    const { env } = context;

    // Comprehensive CORS headers for TikTok Studio compatibility
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, HEAD',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Accept, Origin, Cache-Control, X-File-Name',
        'Access-Control-Allow-Credentials': 'false',
        'Access-Control-Max-Age': '86400',
        'X-Frame-Options': 'ALLOWALL',
        'Content-Security-Policy': "frame-ancestors *",
        'X-Content-Type-Options': 'nosniff',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Content-Type': 'application/json'
    };

    try {
        // Try to use temporary cache using KV with short TTL to avoid persistent storage issues
        let data = null;
        
        try {
            // Try to get from KV with very short TTL (5 minutes max)
            const kvData = await env.OVERLAY_DATA?.get('temp_session');
            if (kvData) {
                data = JSON.parse(kvData);
                console.log('📦 Loaded from KV cache:', data.players);
            }
        } catch (kvError) {
            console.log('⚠️ KV not available, using defaults');
        }
        
        if (!data) {
            // Return default data if not found (matches localhost default exactly)
            data = {
                mode: 'single',
                maxWins: 2,
                players: {
                    p1: { name: 'P1', showName: true, wins: 0 },
                    p2: { name: 'P2', showName: true, wins: 0 }
                },
                settings: {
                    font: 'Komika Axis',
                    fontSize: 80,
                    fontColor: '#ffffff',
                    borderEnabled: true,
                    borderColor: '#000000',
                    borderSize: 2,
                    positiveColor: 'rgb(0, 255, 0)',
                    negativeColor: 'rgb(255, 0, 0)',
                    neutralColor: 'rgb(255, 255, 255)'
                },
                playerSettings: {
                    p1: { font: null, fontSize: null, fontColor: null, borderEnabled: null, borderColor: null, borderSize: null, positiveColor: null, negativeColor: null, neutralColor: null },
                    p2: { font: null, fontSize: null, fontColor: null, borderEnabled: null, borderColor: null, borderSize: null, positiveColor: null, negativeColor: null, neutralColor: null }
                }
            };
        }
        
        return new Response(JSON.stringify({
            success: true,
            timestamp: new Date().toISOString(),
            data: data
        }), { headers: corsHeaders });
        
    } catch (error) {
        return new Response(JSON.stringify({ success: false, error: error.message }), {
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
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, HEAD',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Accept, Origin, Cache-Control, X-File-Name',
            'Access-Control-Allow-Credentials': 'false',
            'Access-Control-Max-Age': '86400',
            'X-Frame-Options': 'ALLOWALL',
            'Content-Security-Policy': "frame-ancestors *"
        }
    });
}