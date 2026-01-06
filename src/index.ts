import { createServer } from './server';

const port = parseInt(Bun.env.PORT || '3000');
const host = Bun.env.HOST || 'localhost';
const dev = Bun.env.NODE_ENV !== 'production';

const server = createServer({ port, hostname: host, development: dev });
Bun.serve(server);

console.log(`running on http://${host}:${port}`);

