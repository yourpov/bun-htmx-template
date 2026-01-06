import { readFile } from 'fs/promises';
import { resolve } from 'path';

async function load(path: string, data: Record<string, any> = {}) {
  const fullPath = resolve(process.cwd(), 'src/views', path);
  let html = await readFile(fullPath, 'utf-8');
  html = html.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    return data[key] !== undefined ? String(data[key]) : '';
  });
  return html;
}

export async function showPage(path: string, data: Record<string, any> = {}) {
  const content = await load(path, data);
  const layout = await load('layouts/main.html', {
    ...data,
    content,
    title: data.title || 'Bun + HTMX',
  });

  return new Response(layout, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

export async function showPart(path: string, data: Record<string, any> = {}) {
  const html = await load(path, data);
  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

export function htmxRes(html: string, opts: {
  trigger?: string | Record<string, any>;
  retarget?: string;
  reswap?: string;
} = {}) {
  const headers: Record<string, string> = { 'Content-Type': 'text/html; charset=utf-8' };

  if (opts.trigger) {
    headers['HX-Trigger'] = typeof opts.trigger === 'string' ? opts.trigger : JSON.stringify(opts.trigger);
  }
  if (opts.retarget) headers['HX-Retarget'] = opts.retarget;
  if (opts.reswap) headers['HX-Reswap'] = opts.reswap;

  return new Response(html, { headers });
}

export function escape(str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export const render = showPage;
export const renderPartial = showPart;
export const htmxResponse = htmxRes;
export const escapeHtml = escape;

export async function renderTemplate(path: string, data: Record<string, any> = {}) {
  return await load(path, data);
}

export function isHtmxRequest(req: Request): boolean {
  return req.headers.get('HX-Request') === 'true';
}
