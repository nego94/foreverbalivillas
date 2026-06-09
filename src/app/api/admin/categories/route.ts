import { NextRequest, NextResponse } from 'next/server';
import { storageGet, storageSet } from '@/lib/storage';

const KEY  = 'fbv:site-content';
const FILE = 'site-content.json';

type Content = Record<string, unknown>;

async function getCategories(): Promise<string[]> {
  const content = await storageGet<Content>(KEY, FILE);
  return (content?.blog as { categories?: string[] })?.categories ?? [];
}

export async function GET() {
  return NextResponse.json(await getCategories());
}

export async function POST(req: NextRequest) {
  try {
    const { name } = await req.json() as { name: string };
    const trimmed = name?.trim();
    if (!trimmed) return NextResponse.json({ error: 'Category name required' }, { status: 400 });

    const current  = await storageGet<Content>(KEY, FILE);
    const cats     = (current?.blog as { categories?: string[] })?.categories ?? [];
    if (cats.includes(trimmed)) return NextResponse.json(cats); // already exists

    const updated = {
      ...current,
      blog: { ...(current?.blog as object ?? {}), categories: [...cats, trimmed] },
    };
    await storageSet(KEY, FILE, updated);
    return NextResponse.json([...cats, trimmed], { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Error' }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { name } = await req.json() as { name: string };
    const current  = await storageGet<Content>(KEY, FILE);
    const cats     = (current?.blog as { categories?: string[] })?.categories ?? [];
    const updated  = {
      ...current,
      blog: { ...(current?.blog as object ?? {}), categories: cats.filter(c => c !== name) },
    };
    await storageSet(KEY, FILE, updated);
    return NextResponse.json(updated.blog);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Error' }, { status: 400 });
  }
}
