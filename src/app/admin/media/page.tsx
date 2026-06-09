'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import StorageBanner from '@/components/admin/StorageBanner';
import { uploadFile } from '@/lib/upload';

interface FileItem { filename: string; url: string; isPdf?: boolean }

export default function MediaLibraryPage() {
  const [files,     setFiles]     = useState<FileItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragOver,  setDragOver]  = useState(false);
  const [copied,    setCopied]    = useState<string | null>(null);
  const [error,     setError]     = useState('');
  const [mode,      setMode]      = useState<'custom' | 'kv' | 'file' | null>(null);
  const [filter,       setFilter]       = useState<'all' | 'images' | 'pdfs'>('all');
  const [confirmingUrl, setConfirmingUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(() => {
    fetch('/api/admin/upload')
      .then(r => r.json())
      .then(d => { setFiles(d.files ?? d.images ?? []); setMode(d.mode ?? 'file'); });
  }, []);

  useEffect(() => { load(); }, [load]);

  const upload = async (fileList: FileList | File[]) => {
    const list = Array.from(fileList);
    if (!list.length) return;
    setUploading(true); setError('');

    for (const file of list) {
      try {
        await uploadFile(file);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Upload failed');
      }
    }

    // Reload from server so list is always in sync with Bluehost
    load();
    setUploading(false);
  };

  const deleteFile = async (file: FileItem) => {
    if (confirmingUrl !== file.url) {
      setConfirmingUrl(file.url);
      setTimeout(() => setConfirmingUrl(null), 3000); // auto-cancel after 3s
      return;
    }
    setConfirmingUrl(null);
    const res = await fetch('/api/admin/upload', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename: file.filename }),
    });
    if (res.ok) setFiles(prev => prev.filter(f => f.filename !== file.filename));
    else setError('Delete failed — try again.');
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    upload(e.dataTransfer.files);
  };

  const copy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  };

  const displayed = files.filter(f =>
    filter === 'all' ? true : filter === 'pdfs' ? f.isPdf : !f.isPdf
  );
  const pdfCount   = files.filter(f => f.isPdf).length;
  const imageCount = files.filter(f => !f.isPdf).length;

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--adm-text)' }}>Media Library</h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--adm-muted)', marginTop: '2px' }}>
            {files.length} file{files.length !== 1 ? 's' : ''} · Click any file to copy its URL
          </p>
        </div>
        <button className="adm-btn adm-btn-primary" onClick={() => inputRef.current?.click()} disabled={uploading}>
          {uploading ? 'Uploading…' : '↑ Upload File'}
        </button>
        <input ref={inputRef} type="file" accept="image/*,application/pdf" multiple style={{ display: 'none' }}
          onChange={e => e.target.files && upload(e.target.files)} />
      </div>

      {error && <div className="adm-alert adm-alert-error">{error}</div>}

      <StorageBanner mode={mode} />

      {/* ── Drop zone ── */}
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        style={{
          border: `2px dashed ${dragOver ? 'var(--adm-accent)' : 'var(--adm-border)'}`,
          borderRadius: '12px',
          padding: '36px',
          textAlign: 'center',
          cursor: 'pointer',
          marginBottom: '28px',
          background: dragOver ? 'rgba(44,95,90,0.04)' : 'transparent',
          transition: 'all 0.15s',
        }}
      >
        {uploading
          ? <p style={{ color: 'var(--adm-accent)', fontWeight: 500 }}>Uploading… this may take a moment for larger files.</p>
          : <>
              <p style={{ fontSize: '2rem', marginBottom: '8px' }}>📁</p>
              <p style={{ fontSize: '0.84rem', color: 'var(--adm-text)', fontWeight: 500 }}>
                Drop files here or click to upload
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '10px' }}>
                {[
                  { label: 'JPG / PNG / WEBP / GIF / SVG', limit: '10 MB' },
                  { label: 'PDF', limit: '25 MB' },
                  { label: 'MP4 / WebM (video)', limit: '30 MB' },
                ].map(({ label, limit }) => (
                  <span key={label} style={{
                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                    fontSize: '0.72rem', padding: '3px 10px', borderRadius: '20px',
                    background: 'var(--adm-bg, #f3f4f6)', border: '1px solid var(--adm-border)',
                    color: 'var(--adm-muted)',
                  }}>
                    {label}
                    <strong style={{ color: 'var(--adm-text)', marginLeft: '2px' }}>max {limit}</strong>
                  </span>
                ))}
              </div>
            </>
        }
      </div>

      {/* ── How to use ── */}
      <div className="adm-card" style={{ marginBottom: '20px', padding: '16px 20px' }}>
        <p style={{ fontSize: '0.78rem', color: 'var(--adm-muted)', lineHeight: 1.7 }}>
          <strong style={{ color: 'var(--adm-text)' }}>How to use:</strong>{' '}
          Upload an image or PDF → click <strong>Copy URL</strong> → paste into any URL field in the Pages or Blog editors.
          For spa/food menus, upload a PDF here, copy the URL, then paste it into <strong>Pages → Homepage → Key Features → Spa/Food Menu URL</strong>.
        </p>
      </div>

      {/* ── Filter tabs ── */}
      {files.length > 0 && (
        <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
          {(['all', 'images', 'pdfs'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{
                padding: '6px 14px', fontSize: '0.78rem', borderRadius: '6px', border: '1px solid var(--adm-border)',
                background: filter === f ? 'var(--adm-accent)' : 'transparent',
                color: filter === f ? '#fff' : 'var(--adm-muted)',
                cursor: 'pointer', fontFamily: 'var(--adm-font)',
              }}>
              {f === 'all' ? `All (${files.length})` : f === 'pdfs' ? `PDFs (${pdfCount})` : `Images (${imageCount})`}
            </button>
          ))}
        </div>
      )}

      {/* ── File grid ── */}
      {displayed.length === 0 && !uploading && (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--adm-muted)' }}>
          <p style={{ fontSize: '2.5rem', marginBottom: '12px' }}>{filter === 'pdfs' ? '📄' : '🖼'}</p>
          <p>No {filter === 'pdfs' ? 'PDFs' : filter === 'images' ? 'images' : 'files'} uploaded yet.</p>
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: '12px',
      }}>
        {displayed.map(file => (
          <div key={file.url} style={{ position: 'relative', borderRadius: '10px', border: '1px solid var(--adm-border)', background: '#f9fafb' }}>

            {/* Delete button — click once to arm, click again to confirm */}
            <button
              onClick={() => deleteFile(file)}
              title={confirmingUrl === file.url ? 'Click again to confirm delete' : 'Delete file'}
              style={{
                position: 'absolute', top: '-10px', right: '-10px', zIndex: 60,
                width: confirmingUrl === file.url ? 'auto' : '28px',
                height: '28px', borderRadius: '14px',
                padding: confirmingUrl === file.url ? '0 10px' : '0',
                background: confirmingUrl === file.url ? '#dc2626' : 'rgba(220,38,38,0.85)',
                color: '#fff',
                border: '2px solid #fff', cursor: 'pointer',
                fontSize: confirmingUrl === file.url ? '0.65rem' : '14px',
                fontWeight: 700, whiteSpace: 'nowrap',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
                transition: 'all 0.15s',
              }}
            >
              {confirmingUrl === file.url ? 'Confirm?' : '×'}
            </button>

            {/* Preview — click to copy, overflow:hidden only on image container */}
            <div
              style={{ aspectRatio: '1', overflow: 'hidden', borderRadius: '9px 9px 0 0', background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              onClick={() => copy(file.url)}
              title="Click to copy URL"
            >
              {file.isPdf ? (
                <div style={{ textAlign: 'center', padding: '16px' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>📄</div>
                  <div style={{ fontSize: '0.65rem', color: '#6b7280', fontWeight: 600, letterSpacing: '0.05em' }}>PDF</div>
                </div>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={file.url} alt={file.filename} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
              )}
            </div>

            {/* Filename + copy */}
            <div style={{ padding: '8px 10px' }}>
              <p style={{ fontSize: '0.65rem', color: 'var(--adm-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '6px' }}>
                {file.filename}
              </p>
              <button
                className="adm-btn adm-btn-ghost adm-btn-sm"
                style={{
                  width: '100%', justifyContent: 'center', fontSize: '0.65rem',
                  background: copied === file.url ? 'var(--adm-accent)' : undefined,
                  color: copied === file.url ? '#fff' : undefined,
                  borderColor: copied === file.url ? 'var(--adm-accent)' : undefined,
                }}
                onClick={() => copy(file.url)}
              >
                {copied === file.url ? '✓ Copied!' : 'Copy URL'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
