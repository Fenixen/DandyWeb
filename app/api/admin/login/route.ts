import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { signToken, SESSION_COOKIE } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const Schema = z.object({ password: z.string().min(1).max(200) });

export async function POST(req: NextRequest) {
  const parsed = Schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Neplatná data.' }, { status: 400 });

  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return NextResponse.json({ error: 'Admin není nakonfigurován.' }, { status: 500 });
  if (parsed.data.password !== expected) {
    return NextResponse.json({ error: 'Nesprávné heslo.' }, { status: 401 });
  }

  const token = await signToken({ sub: 'admin' });
  const res = NextResponse.json({ ok: true });

  // secure: true only when accessed over HTTPS (HTTPS_ONLY env var set)
  // For local Docker/HTTP deployments, secure must be false so the cookie
  // is sent back by browsers on other devices on the local network.
  const isSecure = process.env.HTTPS_ONLY === 'true';

  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: isSecure,
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
