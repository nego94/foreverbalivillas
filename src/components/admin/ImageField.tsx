'use client';

import { useRef, useState } from 'react';
import { uploadFile } from '@/lib/upload';

interface Props {
  label:     string;
  value:     string;           // current image URL or path
  onChange:  (url: string) => void;
  hint?:     string;
  folder?:   string;           // e.g. "blog", "villas/pandawa", "homepage"
  aspect?:   string;           // CSS aspect-ratio for preview, e.g. "16/9"
  stacked?:  boolean;          // stack preview above controls (use in narrow sidebars)
}

export default function ImageField({ label, value, onChange, hint, aspect = '16/9', stacked = false }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error,     setError]     = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = async (file: File) => {
    setUploading(true); setError('');
    try {
      const data = await uploadFile(file);
      onChange(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed — check your connection.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="adm-form-group">
      <label className="adm-label">
        {label}
        {hint && <span className="adm-label-hint">{hint}</span>}
      </label>

      <div style={stacked
        ? { display: 'flex', flexDirection: 'column', gap: '10px' }
        : { display: 'grid', gridTemplateColumns: value ? '180px 1fr' : '1fr', gap: '12px', alignItems: 'start' }
      }>

        {/* Current image preview */}
        {value && (
          <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--adm-border)', aspectRatio: aspect, background: '#f3f4f6' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Current"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              onError={e => {
                const el = e.currentTarget;
                el.style.display = 'none';
                const parent = el.parentElement;
                if (parent && !parent.querySelector('.img-placeholder')) {
                  const ph = document.createElement('div');
                  ph.className = 'img-placeholder';
                  ph.style.cssText = 'position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;color:#9ca3af;font-size:0.72rem;font-family:system-ui';
                  ph.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg><span>Image not loaded</span><span style="font-size:0.65rem;word-break:break-all;padding:0 8px;text-align:center">' + value.slice(0, 50) + '</span>';
                  parent.appendChild(ph);
                }
              }}
            />
            <button
              type="button"
              onClick={() => onChange('')}
              style={{ position: 'absolute', top: '6px', right: '6px', background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', borderRadius: '50%', width: '22px', height: '22px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}
              title="Remove image"
            >✕</button>
          </div>
        )}

        {/* Controls */}
        <div>
          {/* URL input */}
          <input
            className="adm-input"
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder="/images/your-image.jpg  or paste a full URL"
            style={{ marginBottom: '8px' }}
          />

          {/* Upload button */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              type="button"
              className="adm-btn adm-btn-ghost adm-btn-sm"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
            >
              {uploading
                ? <><Spinner /> Uploading…</>
                : <>{value ? '↑ Replace image' : '↑ Upload image'}</>
              }
            </button>

            {value && (
              <a href={value} target="_blank" rel="noreferrer" className="adm-btn adm-btn-ghost adm-btn-sm" style={{ textDecoration: 'none' }}>
                Preview ↗
              </a>
            )}
          </div>

          {error && <p style={{ color: 'var(--adm-danger)', fontSize: '0.75rem', marginTop: '6px' }}>{error}</p>}

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={e => { const f = e.target.files?.[0]; if (f) upload(f); e.target.value = ''; }}
          />

          <p style={{ fontSize: '0.7rem', color: 'var(--adm-muted)', marginTop: '6px' }}>
            Paste a path from your project (<code>/images/…</code>) or upload a new file.
          </p>
        </div>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      style={{ animation: 'spin 1s linear infinite' }}>
      <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/>
      <path d="M12 2a10 10 0 0 1 10 10" />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </svg>
  );
}
