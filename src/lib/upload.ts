// Shared upload utility for admin components.
// For custom storage (Bluehost), uploads go directly browser → Bluehost,
// bypassing the Vercel function and its 4.5 MB body size limit.

interface UploadConfig {
  mode: 'custom' | 'blob' | 'local';
  uploadUrl?: string;
  key?: string;
}

let configCache: UploadConfig | null = null;

async function getConfig(): Promise<UploadConfig> {
  if (configCache) return configCache;
  const res = await fetch('/api/admin/upload-config');
  configCache = await res.json();
  return configCache!;
}

export interface UploadResult { url: string; filename: string; }

export async function uploadFile(file: File): Promise<UploadResult> {
  const config = await getConfig();

  const isVideo = file.type.startsWith('video/');
  const isPdf   = file.type === 'application/pdf';
  const maxBytes = isVideo ? 30 * 1024 * 1024 : isPdf ? 25 * 1024 * 1024 : 10 * 1024 * 1024;
  if (file.size > maxBytes) {
    throw new Error(`File too large. Max ${isVideo ? '30 MB' : isPdf ? '25 MB' : '10 MB'}.`);
  }

  const form = new FormData();
  form.append('file', file);

  if (config.mode === 'custom' && config.uploadUrl) {
    // Direct upload — browser → Bluehost, no Vercel in the middle
    const res = await fetch(config.uploadUrl, {
      method: 'POST',
      headers: { 'X-Api-Key': config.key ?? '' },
      body: form,
    });
    if (!res.ok) {
      const msg = await res.text().catch(() => res.statusText);
      throw new Error(`Upload failed: ${msg}`);
    }
    return res.json() as Promise<UploadResult>;
  }

  // Blob or local — go through Vercel route
  const res = await fetch('/api/admin/upload', { method: 'POST', body: form });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Upload failed');
  return data as UploadResult;
}
