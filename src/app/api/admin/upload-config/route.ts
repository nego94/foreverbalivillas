import { NextResponse } from 'next/server';

// Returns upload target so the browser can upload directly to Bluehost,
// bypassing the Vercel function body-size limit (4.5 MB on Hobby plan).
export async function GET() {
  const url = process.env.CUSTOM_STORAGE_URL;
  const key = process.env.CUSTOM_STORAGE_KEY ?? '';
  if (url) {
    return NextResponse.json({ mode: 'custom', uploadUrl: `${url}/media.php`, key });
  }
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ mode: 'blob' });
  }
  return NextResponse.json({ mode: 'local' });
}
