/**
 * Segment Proxy Edge Function
 *
 * This Edge Function receives events from the client-side tracker
 * and forwards them to Segment's API server-side, adding:
 * - IP address (from Azion headers)
 * - User Agent (from request headers)
 * - App context (Azion Docs site identification)
 *
 * This avoids ad-blockers by using a proxy approach.
 */

// Segment API endpoint for batch events
const SEGMENT_API_URL = 'https://api.segment.io/v1/batch';

// App context for all events
const APP_CONTEXT = {
    app: {
        name: 'Azion Docs',
        version: '1.0.0',
        namespace: 'docs'
    },
    site: 'docs',
    product: 'documentation'
};

/**
 * Handles incoming requests to the Segment proxy
 */
async function handleRequest(request) {
    // Only allow POST requests
    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: {
                'Content-Type': 'application/json',
                'Allow': 'POST'
            }
        });
    }

    try {
        // Parse the request body
        const body = await request.json();
        const { writeKey, events } = body;

        // Validate required fields
        if (!writeKey) {
            return new Response(JSON.stringify({ error: 'Missing writeKey' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        if (!events || !Array.isArray(events) || events.length === 0) {
            return new Response(JSON.stringify({ error: 'Missing or invalid events array' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Get IP and User-Agent from request headers
        // Azion provides the real client IP in X-Forwarded-For or X-Real-IP
        const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
            request.headers.get('x-real-ip') ||
            request.headers.get('cf-connecting-ip') ||
            'unknown';

        const userAgent = request.headers.get('user-agent') || 'unknown';

        // Enrich events with IP, User-Agent and App context
        const enrichedEvents = events.map(event => {
            const enriched = { ...event };

            // Add context with IP, userAgent, and app context
            if (enriched.data) {
                enriched.data.context = {
                    ...enriched.data.context,
                    ...APP_CONTEXT,
                    ip: clientIP,
                    userAgent: userAgent
                };

                // Add site to properties if present
                if (enriched.data.properties) {
                    enriched.data.properties = {
                        ...enriched.data.properties,
                        site: 'docs'
                    };
                }
            }

            return enriched;
        });

        // Transform events to Segment batch format
        const batchPayload = {
            batch: enrichedEvents.map(event => {
                const timestamp = new Date().toISOString();

                switch (event.type) {
                    case 'page':
                        return {
                            type: 'page',
                            name: event.data.properties?.title || event.data.name,
                            anonymousId: event.data.anonymousId,
                            userId: event.data.userId,
                            context: event.data.context,
                            properties: event.data.properties,
                            timestamp
                        };

                    case 'track':
                        return {
                            type: 'track',
                            event: event.data.event,
                            anonymousId: event.data.anonymousId,
                            userId: event.data.userId,
                            context: event.data.context,
                            properties: event.data.properties,
                            timestamp
                        };

                    case 'identify':
                        return {
                            type: 'identify',
                            anonymousId: event.data.anonymousId,
                            userId: event.data.userId,
                            context: event.data.context,
                            traits: event.data.traits,
                            timestamp
                        };

                    default:
                        return null;
                }
            }).filter(Boolean)
        };

        // Send to Segment API
        const segmentResponse = await fetch(SEGMENT_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${btoa(writeKey + ':')}`
            },
            body: JSON.stringify(batchPayload)
        });

        if (!segmentResponse.ok) {
            const errorText = await segmentResponse.text();
            console.error('Segment API error:', segmentResponse.status, errorText);

            return new Response(JSON.stringify({
                error: 'Failed to send to Segment',
                details: errorText
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        });

    } catch (error) {
        console.error('Segment proxy error:', error);

        return new Response(JSON.stringify({
            error: 'Internal server error',
            message: error.message
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

/**
 * Handle CORS preflight requests
 */
function handleOptions() {
    return new Response(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '86400'
        }
    });
}

/**
 * Main event listener
 */
addEventListener('fetch', event => {
    const request = event.request;

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
        event.respondWith(handleOptions());
        return;
    }

    event.respondWith(handleRequest(request));
});
