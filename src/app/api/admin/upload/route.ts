import { NextRequest, NextResponse } from 'next/server';
import { STORAGE_MODE } from '@/lib/storage';
import path from 'path';
import fs from 'fs';

const CUSTOM_URL = process.env.CUSTOM_STORAGE_URL;
const CUSTOM_KEY = process.env.CUSTOM_STORAGE_KEY ?? '';

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get('file') as File | null;
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

    const allowed = [
      'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml',
      'application/pdf',
      'video/mp4', 'video/webm', 'video/quicktime',
    ];
    if (!allowed.includes(file.type)) {
      return NextResponse.json({ error: 'File type not allowed. Use JPG, PNG, WEBP, PDF, MP4, or WebM.' }, { status: 400 });
    }
    const isVideo = file.type.startsWith('video/');
    const isPdf   = file.type === 'application/pdf';
    const maxSize = isVideo ? 30 * 1024 * 1024 : isPdf ? 25 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: `File too large. Max ${isVideo ? '30MB' : isPdf ? '25MB' : '10MB'}.` }, { status: 400 });
    }

    // ── Custom shared hosting ─────────────────────────────────────────────────
    if (CUSTOM_URL) {
      const upstream = new FormData();
      upstream.append('file', file);
      const res = await fetch(`${CUSTOM_URL}/media.php`, {
        method: 'POST',
        headers: { 'X-Api-Key': CUSTOM_KEY },
        body: upstream,
      });
      if (!res.ok) {
        const err = await res.text();
        return NextResponse.json({ error: `Hosting upload failed: ${err}` }, { status: 502 });
      }
      return NextResponse.json(await res.json());
    }

    // ── Vercel Blob ───────────────────────────────────────────────────────────
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const { put } = await import('@vercel/blob');
      const ext      = path.extname(file.name);
      const name     = path.basename(file.name, ext).replace(/[^a-z0-9-]/gi, '-').toLowerCase();
      const filename = `${name}-${Date.now()}${ext}`;
      const blob     = await put(`uploads/${filename}`, file, { access: 'public' });
      return NextResponse.json({ url: blob.url, filename });
    }

    // ── Local fallback (dev only) ─────────────────────────────────────────────
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

    const ext      = path.extname(file.name);
    const name     = path.basename(file.name, ext).replace(/[^a-z0-9-]/gi, '-').toLowerCase();
    const filename = `${name}-${Date.now()}${ext}`;
    const dest     = path.join(uploadsDir, filename);
    const bytes    = await file.arrayBuffer();
    fs.writeFileSync(dest, Buffer.from(bytes));

    return NextResponse.json({ url: `/uploads/${filename}`, filename });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Upload failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// List all files from Bluehost images/ folder
export async function GET() {
  if (CUSTOM_URL) {
    try {
      const res = await fetch(`${CUSTOM_URL}/media.php`, {
        headers: { 'X-Api-Key': CUSTOM_KEY },
        cache: 'no-store',
      });
      if (res.ok) {
        const files = await res.json();
        return NextResponse.json({ files, mode: 'custom' });
      }
    } catch {}
    return NextResponse.json({ files: [], mode: 'custom' });
  }

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ files: [], mode: 'kv' });
  }

  // Local fallback
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadsDir)) return NextResponse.json({ files: [], mode: 'file' });

  const files = fs.readdirSync(uploadsDir)
    .filter(f => /\.(jpe?g|png|webp|gif|svg|pdf|mp4|webm|mov)$/i.test(f))
    .map(f => ({ filename: f, url: `/uploads/${f}`, isPdf: /\.pdf$/i.test(f) }))
    .reverse();

  return NextResponse.json({ files, mode: 'file' });
}

// Delete a file from Bluehost
export async function DELETE(req: NextRequest) {
  try {
    const { filename } = await req.json();
    if (!filename) return NextResponse.json({ error: 'No filename' }, { status: 400 });

    if (CUSTOM_URL) {
      // Use POST with _action=delete — shared hosts block HTTP DELETE method
      const res = await fetch(`${CUSTOM_URL}/media.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Api-Key': CUSTOM_KEY },
        body: JSON.stringify({ _action: 'delete', filename }),
      });
      if (!res.ok) {
        const err = await res.text().catch(() => res.statusText);
        return NextResponse.json({ error: `Delete failed: ${err}` }, { status: 502 });
      }
      return NextResponse.json({ ok: true });
    }

    // Local fallback
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    const filepath   = path.join(uploadsDir, path.basename(filename));
    if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Delete failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
