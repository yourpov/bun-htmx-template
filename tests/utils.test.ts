import { describe, test, expect } from 'bun:test';
import { escapeHtml } from '../src/utils/html';
import { parseCookies, createCookie } from '../src/utils/cookies';
import { validateRequired } from '../src/utils/request';

describe('HTML Utils', () => {
  test('should escape HTML characters', () => {
    const input = '<script>alert("XSS")</script>';
    const expected = '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;';
    expect(escapeHtml(input)).toBe(expected);
  });

  test('should escape ampersands', () => {
    expect(escapeHtml('Tom & Jerry')).toBe('Tom &amp; Jerry');
  });

  test('should escape quotes', () => {
    expect(escapeHtml("It's a \"test\"")).toBe('It&#039;s a &quot;test&quot;');
  });
});

describe('Cookie Utils', () => {
  test('should parse cookies from header', () => {
    const req = new Request('http://localhost:3000', {
      headers: { Cookie: 'name=value; foo=bar' },
    });
    const cookies = parseCookies(req);

    expect(cookies.name).toBe('value');
    expect(cookies.foo).toBe('bar');
  });

  test('should return empty object for no cookies', () => {
    const req = new Request('http://localhost:3000');
    const cookies = parseCookies(req);

    expect(cookies).toEqual({});
  });

  test('should create cookie string', () => {
    const cookie = createCookie('session', 'abc123', {
      httpOnly: true,
      secure: true,
      maxAge: 3600,
    });

    expect(cookie).toContain('session=abc123');
    expect(cookie).toContain('HttpOnly');
    expect(cookie).toContain('Secure');
    expect(cookie).toContain('Max-Age=3600');
  });

  test('should include default path', () => {
    const cookie = createCookie('test', 'value');
    expect(cookie).toContain('Path=/');
  });
});

describe('Request Utils', () => {
  test('should validate required fields', () => {
    const data = { name: 'John', email: 'john@example.com' };
    const result = validateRequired(data, ['name', 'email']);

    expect(result.valid).toBe(true);
    expect(result.missing).toEqual([]);
  });

  test('should detect missing fields', () => {
    const data = { name: 'John' };
    const result = validateRequired(data, ['name', 'email', 'password']);

    expect(result.valid).toBe(false);
    expect(result.missing).toEqual(['email', 'password']);
  });

  test('should detect empty string fields', () => {
    const data = { name: '   ', email: 'john@example.com' };
    const result = validateRequired(data, ['name', 'email']);

    expect(result.valid).toBe(false);
    expect(result.missing).toEqual(['name']);
  });
});
