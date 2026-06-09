import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SESSION_COOKIE = 'fbv_admin_session';
const PUBLIC_PATHS   = ['/admin/login', '/api/admin/auth/login', '/api/admin/auth/logout'];

function getSecret() {
  return new TextEncoder().encode(
    process.env.ADMIN_SECRET || 'fbv-dev-secret-change-in-production',
  );
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC_PATHS.some(p => pathname === p)) return NextResponse.next();

  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    const token = req.cookies.get(SESSION_COOKIE)?.value ?? '';
    let valid = false;
    try {
      if (token) { await jwtVerify(token, getSecret()); valid = true; }
    } catch { /* expired or invalid */ }

    if (!valid) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
