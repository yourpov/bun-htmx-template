import { describe, test, expect } from 'bun:test';
import { createServer } from '../src/server';

describe('Server', () => {
  const server = createServer({
    port: 3001,
    hostname: 'localhost',
    development: true,
  });

  test('should handle health check endpoint', async () => {
    const req = new Request('http://localhost:3001/health');
    const response = await server.fetch(req);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.status).toBe('ok');
    expect(data.timestamp).toBeDefined();
  });

  test('should return 404 for unknown routes', async () => {
    const req = new Request('http://localhost:3001/unknown-route');
    const response = await server.fetch(req);

    expect(response.status).toBe(404);
  });

  test('should serve home page', async () => {
    const req = new Request('http://localhost:3001/');
    const response = await server.fetch(req);

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toContain('text/html');
  });

  test('should include security headers', async () => {
    const req = new Request('http://localhost:3001/health');
    const response = await server.fetch(req);

    expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
    expect(response.headers.get('X-Frame-Options')).toBe('SAMEORIGIN');
    expect(response.headers.get('X-XSS-Protection')).toBeDefined();
  });

  test('should handle CORS preflight', async () => {
    const req = new Request('http://localhost:3001/health', {
      method: 'OPTIONS',
    });
    const response = await server.fetch(req);

    expect(response.status).toBe(204);
    expect(response.headers.get('Access-Control-Allow-Methods')).toBeDefined();
  });
});
