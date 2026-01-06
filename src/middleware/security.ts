export function secHeaders(res: Response): Response {
  const headers = new Headers(res.headers);

  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'SAMEORIGIN');
  headers.set('X-XSS-Protection', '1; mode=block');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  const dev = Bun.env.NODE_ENV === 'development';
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://unpkg.com https://cdn.tailwindcss.com blob:",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "connect-src 'self'",
    dev ? "connect-src 'self' ws: wss:" : "",
  ].filter(Boolean).join('; ');
  
  headers.set('Content-Security-Policy', csp);

  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers,
  });
}
