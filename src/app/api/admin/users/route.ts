import { NextRequest, NextResponse } from 'next/server';
import { getUsers, createUser, deleteUser } from '@/lib/admin-data';
import { hashPassword, verifyToken, SESSION_COOKIE } from '@/lib/admin-auth';
import crypto from 'crypto';

export async function GET() {
  const users = (await getUsers()).map(({ passwordHash: _h, passwordSalt: _s, ...u }) => u);
  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  const token   = req.cookies.get(SESSION_COOKIE)?.value ?? '';
  const session = await verifyToken(token);
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { username, name, password, role } = await req.json() as {
      username: string; name: string; password: string; role: 'admin' | 'editor';
    };
    if (!username || !name || !password) {
      return NextResponse.json({ error: 'username, name, and password are required' }, { status: 400 });
    }
    const { hash, salt } = hashPassword(password);
    const user = await createUser({
      id: crypto.randomUUID(),
      username, name,
      role: role === 'admin' ? 'admin' : 'editor',
      passwordHash: hash,
      passwordSalt: salt,
      createdAt: new Date().toISOString(),
    });
    const { passwordHash: _h, passwordSalt: _s, ...safe } = user;
    return NextResponse.json(safe, { status: 201 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  const token   = req.cookies.get(SESSION_COOKIE)?.value ?? '';
  const session = await verifyToken(token);
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const { id } = await req.json() as { id: string };
  await deleteUser(id);
  return NextResponse.json({ ok: true });
}
