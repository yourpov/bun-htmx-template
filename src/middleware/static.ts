/**
 * Static file handler middleware - serves files from public directory
 */

import { resolve, extname } from 'path';

const types: Record<string, string> = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

export async function serveFile(req: Request): Promise<Response | null> {
  const url = new URL(req.url);
  
  if (req.method !== 'GET') return null;
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/todos') || url.pathname.startsWith('/users')) {
    return null;
  }
  if (url.pathname.includes('..')) return null;

  const path = resolve(process.cwd(), 'public', url.pathname.slice(1));

  try {
    const f = Bun.file(path);
    if (!(await f.exists())) return null;

    const ext = extname(url.pathname).toLowerCase();
    const mime = types[ext] || 'application/octet-stream';

    return new Response(f, {
      headers: {
        'Content-Type': mime,
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  } catch {
    return null;
  }
}
