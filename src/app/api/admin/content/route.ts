import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { storageGet, storageSet, STORAGE_MODE } from '@/lib/storage';

const KEY  = 'fbv:site-content';
const FILE = 'site-content.json';

export async function GET() {
  const data = await storageGet(KEY, FILE);
  return NextResponse.json({ data, storage: STORAGE_MODE });
}

export async function PUT(req: NextRequest) {
  try {
    const patch = await req.json();
    // Deep merge with existing content
    const current = await storageGet<Record<string, unknown>>(KEY, FILE);
    const merged  = deepMerge(current as Record<string, unknown>, patch);
    await storageSet(KEY, FILE, merged);
    // Immediately clear Vercel cache for all content-driven pages
    for (const p of ['/', '/forever-pandawa', '/forever-santai', '/faq', '/cancellation-policy', '/privacy-policy']) {
      revalidatePath(p);
    }
    return NextResponse.json({ data: merged, storage: STORAGE_MODE });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function deepMerge(target: Record<string, any>, source: Record<string, any>): Record<string, any> {
  const out = { ...target };
  for (const key of Object.keys(source)) {
    if (source[key] !== null && typeof source[key] === 'object' && !Array.isArray(source[key]) &&
        target[key] !== null && typeof target[key] === 'object' && !Array.isArray(target[key])) {
      out[key] = deepMerge(target[key], source[key]);
    } else {
      out[key] = source[key];
    }
  }
  return out;
}
