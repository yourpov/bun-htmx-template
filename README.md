# Bun + HTMX

server template for building web apps

## what's this?

essentials for server-side rendered apps using bun runtime and htmx.

## features

- **bun runtime** - fast js/ts runtime
- **htmx integration** - dynamic interactions without writing js
- **simple router** - lightweight routing with params support
- **security headers** - csp and other headers configured out of the box
- **typescript** - fully typed
- **websocket support** - live bidirectional communication
- **hot reload** - instant feedback during development

## quick start

```bash
bun install
bun dev
```

server runs on `http://localhost:3000`

## websocket usage

basic echo server is included. messages sent from client are echoed back.

```javascript
const ws = new WebSocket('ws://localhost:3000');

ws.onopen = () => console.log('connected');
ws.onmessage = (e) => console.log('received:', e.data);
ws.send('hello server');
```

customize websocket handlers in `src/server.ts`:

```typescript
websocket: {
  open(ws) {
    // handle connection
  },
  message(ws, msg) {
    // handle incoming messages
    ws.send(msg); // echo back
  },
  close(ws) {
    // handle disconnect
  },
}
```

## env variables

- `PORT` - server port (default: 3000)
- `HOST` - hostname (default: localhost)
- `NODE_ENV` - environment (development/production)

## license

MIT
