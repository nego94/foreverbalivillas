import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { getPosts, createPost } from '@/lib/admin-data';
import type { Post } from '@/lib/admin-data';

export async function GET() {
  return NextResponse.json(await getPosts());
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json() as Post;
    if (!data.slug || !data.title) {
      return NextResponse.json({ error: 'slug and title are required' }, { status: 400 });
    }
    data.slug = data.slug.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const post = await createPost({ ...data, date: data.date || new Date().toISOString().slice(0, 10) });
    revalidatePath('/journal');
    revalidatePath('/journal/[slug]', 'page');
    return NextResponse.json(post, { status: 201 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
