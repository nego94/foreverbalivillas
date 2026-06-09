import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, SESSION_COOKIE } from '@/lib/admin-auth';

export async function GET(req: NextRequest) {
  const token   = req.cookies.get(SESSION_COOKIE)?.value ?? '';
  const payload = await verifyToken(token);
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json(payload);
}
