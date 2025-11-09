/**
 * Cloudflare Pages Functions - API Endpoint
 * Path: /functions/api/status.js
 * 
 * This handles GET requests to /api/status
 * Matches localhost /api/status functionality exactly
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
        // Return server status info (similar to localhost)
        const statusInfo = {
            status: 'running',
            timestamp: new Date().toISOString(),
            server: 'Cloudflare Pages Functions',
            version: '1.0.0',
            endpoints: [
                '/api/data',
                '/api/update',
                '/api/status'
            ],
            environment: 'production'
        };
        
        return new Response(JSON.stringify({
            success: true,
            ...statusInfo
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