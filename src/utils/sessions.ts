import { getCookie, setCookie, deleteCookie } from './cookies';

export interface SessionData {
  [key: string]: any;
}

const sessions = new Map<string, SessionData>();

function generateSessionId(): string {
  return crypto.randomUUID();
}

export function getSession(req: Request): SessionData {
  const sessionId = getCookie(req, 'session_id');
  
  if (!sessionId || !sessions.has(sessionId)) {
    return {};
  }

  return sessions.get(sessionId) || {};
}

export function setSession(
  req: Request,
  response: Response,
  data: SessionData
): Response {
  let sessionId = getCookie(req, 'session_id');

  if (!sessionId) {
    sessionId = generateSessionId();
  }

  sessions.set(sessionId, { ...sessions.get(sessionId), ...data });

  return setCookie(response, 'session_id', sessionId, {
    httpOnly: true,
    secure: Bun.env.NODE_ENV === 'production',
    sameSite: 'Lax',
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function destroySession(req: Request, response: Response): Response {
  const sessionId = getCookie(req, 'session_id');

  if (sessionId) {
    sessions.delete(sessionId);
  }

  return deleteCookie(response, 'session_id');
}

export function updateSession(
  req: Request,
  response: Response,
  key: string,
  value: any
): Response {
  const currentSession = getSession(req);
  return setSession(req, response, { ...currentSession, [key]: value });
}

export function cleanupSessions(maxAge: number = 60 * 60 * 24 * 7): void {
  if (sessions.size > 10000) {
    const keysToDelete = Array.from(sessions.keys()).slice(0, 5000);
    keysToDelete.forEach((key) => sessions.delete(key));
  }
}
