// HMAC using Web Crypto — works in both Node 20+ and the Edge runtime (middleware).

const SECRET = process.env.ADMIN_SECRET || 'dev-insecure-secret-change-me';
export const SESSION_COOKIE = 'admin_session';

function b64url(bytes: Uint8Array): string {
  let str = '';
  for (let i = 0; i < bytes.length; i++) str += String.fromCharCode(bytes[i]);
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function b64urlDecode(s: string): Uint8Array {
  const pad = s.length % 4 === 2 ? '==' : s.length % 4 === 3 ? '=' : '';
  const str = atob(s.replace(/-/g, '+').replace(/_/g, '/') + pad);
  const bytes = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) bytes[i] = str.charCodeAt(i);
  return bytes;
}

function strToBytes(s: string): Uint8Array {
  return new TextEncoder().encode(s);
}

async function hmac(data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    strToBytes(SECRET) as unknown as BufferSource,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, strToBytes(data) as unknown as BufferSource);
  return b64url(new Uint8Array(sig));
}

export async function signToken(payload: Record<string, unknown>): Promise<string> {
  const body = b64url(strToBytes(JSON.stringify({ ...payload, iat: Date.now() })));
  const sig = await hmac(body);
  return `${body}.${sig}`;
}

export async function verifyToken(token: string | undefined | null): Promise<Record<string, unknown> | null> {
  if (!token) return null;
  const [body, sig] = token.split('.');
  if (!body || !sig) return null;
  const expected = await hmac(body);
  if (expected.length !== sig.length) return null;
  // constant-time compare
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
  if (diff !== 0) return null;
  try {
    const json = new TextDecoder().decode(b64urlDecode(body));
    const parsed = JSON.parse(json);
    if (typeof parsed.iat !== 'number' || Date.now() - parsed.iat > 30 * 24 * 60 * 60 * 1000) return null;
    return parsed;
  } catch {
    return null;
  }
}
