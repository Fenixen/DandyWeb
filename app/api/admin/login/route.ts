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
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
