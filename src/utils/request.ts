/**
 * Form data parsing utilities
 */

/**
 * Parse form data from request
 */
export async function parseFormData(req: Request): Promise<Record<string, string>> {
  const contentType = req.headers.get('Content-Type') || '';

  if (contentType.includes('application/x-www-form-urlencoded')) {
    const text = await req.text();
    const params = new URLSearchParams(text);
    const data: Record<string, string> = {};

    for (const [key, value] of params.entries()) {
      data[key] = value;
    }

    return data;
  }

  if (contentType.includes('multipart/form-data')) {
    const formData = await req.formData();
    const data: Record<string, string> = {};

    for (const [key, value] of formData.entries()) {
      if (typeof value === 'string') {
        data[key] = value;
      }
    }

    return data;
  }

  return {};
}

/**
 * Parse JSON from request
 */
export async function parseJSON<T = any>(req: Request): Promise<T | null> {
  try {
    return await req.json();
  } catch {
    return null;
  }
}

/**
 * Get query parameters
 */
export function getQueryParams(req: Request): Record<string, string> {
  const url = new URL(req.url);
  const params: Record<string, string> = {};

  for (const [key, value] of url.searchParams.entries()) {
    params[key] = value;
  }

  return params;
}

/**
 * Validate required fields
 */
export function validateRequired(
  data: Record<string, any>,
  fields: string[]
): { valid: boolean; missing: string[] } {
  const missing = fields.filter((field) => !data[field] || data[field].trim() === '');

  return {
    valid: missing.length === 0,
    missing,
  };
}
