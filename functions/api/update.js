/**
 * Cloudflare Pages Functions - API Endpoint
 * Path: /functions/api/update.js
 * 
 * This handles POST requests to /api/update
 * Matches localhost /api/update functionality exactly
 */

export async function onRequestPost(context) {
    const { request, env } = context;

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
        const updateData = await request.json();
        
        // Use in-memory storage only (no KV to avoid rate limits)
        // Get current data from memory or use default
        let currentData = {
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

        // Store in global memory (works for current session)
        if (!globalThis.overlayData) {
            globalThis.overlayData = currentData;
        }
        
        // Merge the update with current data (deep merge)
        const mergedData = mergeDeep(globalThis.overlayData, updateData);
        globalThis.overlayData = mergedData;
        
        return new Response(JSON.stringify({
            success: true,
            timestamp: new Date().toISOString(),
            message: 'Data updated successfully (memory storage)',
            data: mergedData
        }), { headers: corsHeaders });
        
    } catch (error) {
        return new Response(JSON.stringify({ 
            success: false, 
            error: error.message 
        }), {
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

// Deep merge function to handle nested objects
function mergeDeep(target, source) {
    if (source === null || source === undefined) return target;
    if (typeof source !== 'object') return source;
    
    const result = Array.isArray(target) ? [...target] : { ...target };
    
    for (const key in source) {
        if (source.hasOwnProperty(key)) {
            if (source[key] !== null && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                result[key] = mergeDeep(result[key] || {}, source[key]);
            } else {
                result[key] = source[key];
            }
        }
    }
    
    return result;
}