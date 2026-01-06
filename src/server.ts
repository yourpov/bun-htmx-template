import { Router } from './router';
import { logReq } from './middleware/logger';
import { handleErr } from './middleware/errorHandler';
import { secHeaders } from './middleware/security';
import { serveFile } from './middleware/static';
import { handleCors } from './middleware/cors';
import { setupRoutes } from './routes';
import type { ServerWebSocket } from 'bun';

interface ServerConfig {
  port: number;
  hostname: string;
  development?: boolean;
}

export function createServer(config: ServerConfig) {
  const router = new Router();

  setupRoutes(router);

  router.get('/health', () => {
    return Response.json({ ok: true, time: new Date().toISOString() });
  });

  const fetch = async (req: Request, server: any): Promise<Response> => {
    try {
      if (server.upgrade(req)) {
        return new Response(null);
      }

      const cors = await handleCors(req);
      if (cors) return cors;

      logReq(req);

      const staticFile = await serveFile(req);
      if (staticFile) return secHeaders(staticFile);

      const match = router.match(req);
      if (!match) {
        return secHeaders(new Response('Not Found', { status: 404 }));
      }

      const res = await match.handler(req, match.params);
      return secHeaders(res);
    } catch (err) {
      return handleErr(err as Error, req);
    }
  };

  return {
    fetch,
    port: config.port,
    hostname: config.hostname,
    websocket: {
      open(ws: ServerWebSocket) {
        console.log('ws connected');
      },
      message(ws: ServerWebSocket, msg: string | Buffer) {
        ws.send(msg);
      },
      close(ws: ServerWebSocket) {
        console.log('ws disconnected');
      },
    },
  };
}
