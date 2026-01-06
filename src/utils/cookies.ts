export interface CookieOptions {
  maxAge?: number;
  expires?: Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
}


export function parseCookies(req: Request): Record<string, string> {
  const cookieHeader = req.headers.get('Cookie');
  if (!cookieHeader) return {};

  const cookies: Record<string, string> = {};
  cookieHeader.split(';').forEach((cookie) => {
    const [name, ...rest] = cookie.trim().split('=');
    if (name) {
      cookies[name] = rest.join('=');
    }
  });

  return cookies;
}

export function getCookie(req: Request, name: string): string | undefined {
  const cookies = parseCookies(req);
  return cookies[name];
}

export function createCookie(
  name: string,
  value: string,
  options: CookieOptions = {}
): string {
  const parts = [`${name}=${value}`];

  if (options.maxAge !== undefined) {
    parts.push(`Max-Age=${options.maxAge}`);
  }

  if (options.expires) {
    parts.push(`Expires=${options.expires.toUTCString()}`);
  }

  if (options.path) {
    parts.push(`Path=${options.path}`);
  } else {
    parts.push('Path=/');
  }

  if (options.domain) {
    parts.push(`Domain=${options.domain}`);
  }

  if (options.secure) {
    parts.push('Secure');
  }

  if (options.httpOnly) {
    parts.push('HttpOnly');
  }

  if (options.sameSite) {
    parts.push(`SameSite=${options.sameSite}`);
  }

  return parts.join('; ');
}

export function setCookie(
  response: Response,
  name: string,
  value: string,
  options: CookieOptions = {}
): Response {
  const cookie = createCookie(name, value, options);
  const headers = new Headers(response.headers);
  headers.append('Set-Cookie', cookie);

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export function deleteCookie(response: Response, name: string, path: string = '/'): Response {
  return setCookie(response, name, '', {
    maxAge: 0,
    path,
  });
}
