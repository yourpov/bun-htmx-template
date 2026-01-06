import { Router } from './router';
import { showPage } from './utils/html';

export function setupRoutes(router: Router) {
  router.get('/', async () => {
    return showPage('index.html', { title: 'Home' });
  });

  router.get('/api/time', async () => {
    const now = new Date().toLocaleString();
    return new Response(
      `<div><strong>Server time:</strong> ${now}</div>`,
      { headers: { 'Content-Type': 'text/html' } }
    );
  });

  router.get('/ws-demo', async () => {
    return showPage('ws-demo.html', { title: 'WebSocket Demo' });
  });
}
