export function handleErr(err: Error, req: Request): Response {
  console.error(err);

  const url = new URL(req.url);
  const dev = Bun.env.NODE_ENV === 'development';
  const htmx = req.headers.get('HX-Request') === 'true';

  if (htmx) {
    return new Response(
      `<div class="bg-red-500 text-white p-4 rounded">Error: ${esc(err.message)}</div>`,
      {
        status: 500,
        headers: {
          'Content-Type': 'text/html',
          'HX-Retarget': '#toast-container',
          'HX-Reswap': 'beforeend',
        },
      }
    );
  }

  if (req.headers.get('Accept')?.includes('application/json')) {
    return Response.json(
      {
        error: err.message,
        path: url.pathname,
        ...(dev && { stack: err.stack }),
      },
      { status: 500 }
    );
  }

  return new Response(
    `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Error</title>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="flex items-center justify-center min-h-screen bg-gray-100">
      <div class="text-center">
        <h1 class="text-4xl font-bold text-red-600 mb-4">Something went wrong</h1>
        <p class="text-gray-700 mb-4">${esc(err.message)}</p>
        ${dev && err.stack ? `<pre class="text-left bg-gray-200 p-4 rounded overflow-auto max-w-2xl">${esc(err.stack)}</pre>` : ''}
        <a href="/" class="text-blue-600 hover:underline">go back</a>
      </div>
    </body>
    </html>`,
    { status: 500, headers: { 'Content-Type': 'text/html' } }
  );
}

function esc(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
