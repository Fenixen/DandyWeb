import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken, SESSION_COOKIE } from '@/lib/auth';

// Protect /admin and /api/admin/* except /api/admin/login
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminPage = pathname === '/admin' || pathname.startsWith('/admin/');
  const isAdminApi = pathname.startsWith('/api/admin') &&
    !pathname.startsWith('/api/admin/login');

  if (!isAdminPage && !isAdminApi) return NextResponse.next();

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const ok = await verifyToken(token);
  if (ok) return NextResponse.next();

  if (isAdminApi) {
    return NextResponse.json({ error: 'Nepřihlášen.' }, { status: 401 });
  }
  // Admin page without auth → let it render so the login form shows.
  // The page itself branches on the cookie.
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
