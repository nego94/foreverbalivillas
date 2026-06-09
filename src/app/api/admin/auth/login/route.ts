import { NextRequest, NextResponse } from 'next/server';
import { checkEnvAdmin, signToken, hashPassword, verifyPassword, SESSION_COOKIE } from '@/lib/admin-auth';
import { getUser } from '@/lib/admin-data';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json() as { username: string; password: string };

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password required' }, { status: 400 });
    }

    let userId = 'env-admin';
    let role: 'admin' | 'editor' = 'admin';

    // Check env-based admin first
    const isEnvAdmin = checkEnvAdmin(username, password);

    if (!isEnvAdmin) {
      // Check JSON-stored users
      const user = await getUser(username);
      if (!user || !verifyPassword(password, user.passwordHash, user.passwordSalt)) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }
      userId = user.id;
      role = user.role;
    }

    const token = await signToken({ userId, username, role });

    const res = NextResponse.json({ ok: true, username, role });
    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 8 * 60 * 60, // 8h
    });
    return res;
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
