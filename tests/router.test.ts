import { describe, test, expect } from 'bun:test';
import { Router } from '../src/router';

describe('Router', () => {
  test('should register GET route', () => {
    const router = new Router();
    router.get('/test', () => new Response('OK'));

    const routes = router.getRoutes();
    expect(routes.length).toBe(1);
    expect(routes[0].method).toBe('GET');
    expect(routes[0].path).toBe('/test');
  });

  test('should register POST route', () => {
    const router = new Router();
    router.post('/test', () => new Response('OK'));

    const routes = router.getRoutes();
    expect(routes[0].method).toBe('POST');
  });

  test('should match exact route', () => {
    const router = new Router();
    router.get('/test', () => new Response('Test Response'));

    const req = new Request('http://localhost:3000/test');
    const match = router.match(req);

    expect(match).not.toBeNull();
    expect(match?.params).toEqual({});
  });

  test('should match route with parameters', async () => {
    const router = new Router();
    router.get('/users/:id', (req, params) => {
      return new Response(`User ID: ${params?.id}`);
    });

    const req = new Request('http://localhost:3000/users/123');
    const match = router.match(req);

    expect(match).not.toBeNull();
    expect(match?.params?.id).toBe('123');

    if (match) {
      const response = await match.handler(req, match.params);
      const text = await response.text();
      expect(text).toBe('User ID: 123');
    }
  });

  test('should not match different methods', () => {
    const router = new Router();
    router.get('/test', () => new Response('OK'));

    const req = new Request('http://localhost:3000/test', { method: 'POST' });
    const match = router.match(req);

    expect(match).toBeNull();
  });

  test('should return null for unmatched route', () => {
    const router = new Router();
    router.get('/test', () => new Response('OK'));

    const req = new Request('http://localhost:3000/notfound');
    const match = router.match(req);

    expect(match).toBeNull();
  });

  test('should support all HTTP methods', () => {
    const router = new Router();
    router.get('/get', () => new Response('GET'));
    router.post('/post', () => new Response('POST'));
    router.put('/put', () => new Response('PUT'));
    router.delete('/delete', () => new Response('DELETE'));
    router.patch('/patch', () => new Response('PATCH'));

    const routes = router.getRoutes();
    expect(routes.length).toBe(5);
    expect(routes.map((r) => r.method)).toEqual(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']);
  });

  test('should handle multiple parameters', async () => {
    const router = new Router();
    router.get('/users/:userId/posts/:postId', (req, params) => {
      return Response.json(params);
    });

    const req = new Request('http://localhost:3000/users/42/posts/123');
    const match = router.match(req);

    expect(match).not.toBeNull();
    expect(match?.params?.userId).toBe('42');
    expect(match?.params?.postId).toBe('123');
  });
});
