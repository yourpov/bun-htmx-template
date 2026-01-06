/**
 * CORS middleware - handles Cross-Origin Resource Sharing
 */

export async function handleCors(req: Request): Promise<Response | null> {
  const allowed = Bun.env.CORS_ORIGIN || '*';

  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': allowed,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, HX-Request, HX-Trigger, HX-Target, HX-Current-URL',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  return null;
}
