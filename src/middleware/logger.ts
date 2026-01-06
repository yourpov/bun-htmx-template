export function logReq(req: Request) {
  const url = new URL(req.url);
  const time = new Date().toISOString();
  console.log(`[${time}] ${req.method} ${url.pathname}${url.search}`);
}
