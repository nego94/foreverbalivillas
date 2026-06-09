import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(process.env.ADMIN_SECRET ?? 'dev-secret');

async function isAuthed(): Promise<boolean> {
  try {
    const jar = await cookies();
    const token = jar.get('admin_token')?.value;
    if (!token) return false;
    await jwtVerify(token, SECRET);
    return true;
  } catch {
    return false;
  }
}

// Paths to revalidate after any content save
const PATHS = [
  '/',
  '/journal',
  '/faq',
  '/forever-pandawa',
  '/forever-santai',
  '/cancellation-policy',
  '/privacy-policy',
];

export async function POST(req: NextRequest) {
  if (!await isAuthed()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { paths } = await req.json().catch(() => ({ paths: null }));
  const targets: string[] = paths ?? PATHS;

  for (const p of targets) revalidatePath(p);

  // Also revalidate dynamic blog post routes
  revalidatePath('/journal/[slug]', 'page');

  return NextResponse.json({ revalidated: targets });
}
