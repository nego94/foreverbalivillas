'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import CategorySelect from '../CategorySelect';
import ImageField from '@/components/admin/ImageField';

interface PostForm {
  title: string; slug: string; excerpt: string; body: string; coverImage: string;
  category: string; date: string; gallery: string[];
}

// ── Body editor: shows the gallery split when gallery images are present ──────
function BodyEditor({ body, onChange, hasGallery }: { body: string; onChange: (v: string) => void; hasGallery: boolean }) {
  const paragraphs = body.trim() ? body.split(/\n\n+/) : [];
  const half = Math.ceil(paragraphs.length / 2);
  const before = paragraphs.slice(0, half);
  const after  = paragraphs.slice(half);

  if (!hasGallery) {
    return (
      <div className="adm-form-group" style={{ marginBottom: 0 }}>
        <label className="adm-label">Article Body <span className="adm-label-hint">blank line between paragraphs</span></label>
        <textarea className="adm-textarea" rows={14} value={body} onChange={e => onChange(e.target.value)}
          style={{ fontFamily: 'monospace', fontSize: '0.82rem', lineHeight: 1.7 }} />
      </div>
    );
  }

  return (
    <div className="adm-form-group" style={{ marginBottom: 0 }}>
      <label className="adm-label">Article Body <span className="adm-label-hint">blank line between paragraphs</span></label>

      {/* Live split preview */}
      {paragraphs.length > 0 && (
        <div style={{ background: '#f8f9fa', border: '1px solid var(--adm-border)', borderRadius: '8px', padding: '14px 16px', marginBottom: '10px', fontSize: '0.75rem', color: 'var(--adm-muted)', lineHeight: 1.5 }}>
          <strong style={{ color: 'var(--adm-text)', display: 'block', marginBottom: '6px' }}>Live layout preview:</strong>
          {before.map((p, i) => <div key={i} style={{ marginBottom: '2px' }}>📄 Para {i + 1}: <span style={{ color: '#374151' }}>{p.slice(0, 60)}{p.length > 60 ? '…' : ''}</span></div>)}
          <div style={{ margin: '8px 0', padding: '6px 10px', background: '#dbeafe', borderRadius: '6px', color: '#1e40af', fontWeight: 500 }}>
            🖼 Gallery images appear here
          </div>
          {after.length > 0
            ? after.map((p, i) => <div key={i} style={{ marginBottom: '2px' }}>📄 Para {half + i + 1}: <span style={{ color: '#374151' }}>{p.slice(0, 60)}{p.length > 60 ? '…' : ''}</span></div>)
            : <div style={{ color: '#9ca3af', fontStyle: 'italic' }}>Add more paragraphs to appear after the gallery</div>
          }
        </div>
      )}

      <textarea className="adm-textarea" rows={14} value={body} onChange={e => onChange(e.target.value)}
        style={{ fontFamily: 'monospace', fontSize: '0.82rem', lineHeight: 1.7 }}
        placeholder={"First paragraph here.\n\nSecond paragraph here.\n\n[Gallery appears in the middle]\n\nThird paragraph here.\n\nFourth paragraph here."} />
      <p style={{ fontSize: '0.72rem', color: 'var(--adm-muted)', marginTop: '6px' }}>
        The first {Math.ceil(paragraphs.length / 2) || '½'} paragraph(s) appear before the gallery, the rest after.
      </p>
    </div>
  );
}

export default function EditPostPage() {
  const { slug } = useParams() as { slug: string };
  const router = useRouter();
  const [form, setForm] = useState<PostForm | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/blog/${slug}`)
      .then(r => r.json())
      .then(data => setForm({ ...data, body: data.body ?? '', gallery: data.gallery ?? ['', '', ''] }))
      .catch(() => setError('Failed to load post'));
  }, [slug]);

  if (!form) return <div style={{ padding: '40px', color: 'var(--adm-muted)' }}>{error || 'Loading…'}</div>;

  const set = (k: keyof PostForm, v: string) => setForm(f => f ? { ...f, [k]: v } : f);
  const setGallery = (i: number, v: string) => setForm(f => { if (!f) return f; const g = [...f.gallery]; g[i] = v; return { ...f, gallery: g }; });

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess('');
    setLoading(true);
    const body = { ...form, gallery: form.gallery.filter(Boolean) };
    try {
      const res = await fetch(`/api/admin/blog/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Save failed'); return; }
      setSuccess('Saved! Changes will appear on the site within a few minutes.');
      setTimeout(() => setSuccess(''), 6000);
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <Link href="/admin/blog" className="adm-btn adm-btn-ghost adm-btn-sm">← Back</Link>
        <h1 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--adm-text)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Edit: {form.title}</h1>
        <Link href={`/journal/${slug}`} target="_blank" className="adm-btn adm-btn-ghost adm-btn-sm">View live ↗</Link>
      </div>

      {error && <div className="adm-alert adm-alert-error">{error}</div>}
      {success && <div className="adm-alert adm-alert-ok">{success}</div>}

      <form onSubmit={save}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px', alignItems: 'start' }}>
          <div className="adm-card adm-card-body" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="adm-form-group">
              <label className="adm-label">Title</label>
              <input className="adm-input" value={form.title} onChange={e => set('title', e.target.value)} required />
            </div>
            <div className="adm-form-group">
              <label className="adm-label">Slug <span className="adm-label-hint">URL: /journal/your-slug</span></label>
              <input className="adm-input" style={{ fontFamily: 'monospace', fontSize: '0.82rem' }} value={form.slug} onChange={e => set('slug', e.target.value)} required />
            </div>
            <div className="adm-form-group">
              <label className="adm-label">Excerpt <span className="adm-label-hint">shown in listings</span></label>
              <textarea className="adm-textarea" rows={3} value={form.excerpt} onChange={e => set('excerpt', e.target.value)} />
            </div>
            {/* Article body with gallery split preview */}
            <BodyEditor body={form.body} onChange={v => set('body', v)} hasGallery={form.gallery.some(Boolean)} />
            <ImageField
              label="Cover Image"
              hint="shown in blog listings and at the top of the article"
              value={form.coverImage}
              onChange={v => set('coverImage', v)}
              folder="blog"
              aspect="16/9"
            />

            <div className="adm-form-group" style={{ marginBottom: 0 }}>
              <label className="adm-label">Gallery Images <span className="adm-label-hint">appear in the article body, split around the text</span></label>
              {(form.gallery.length > 0 ? form.gallery : ['', '', '']).map((g, i) => (
                <div key={i} style={{ marginBottom: '12px' }}>
                  <ImageField
                    label={`Gallery Image ${i + 1}`}
                    value={g}
                    onChange={v => setGallery(i, v)}
                    folder="blog"
                    aspect="4/3"
                  />
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="adm-card adm-card-body">
              <div className="adm-form-group">
                <label className="adm-label">Category</label>
                <CategorySelect value={form.category} onChange={v => set('category', v)} />
              </div>
              <div className="adm-form-group" style={{ marginBottom: 0 }}>
                <label className="adm-label">Publish Date</label>
                <input className="adm-input" type="date" value={form.date} onChange={e => set('date', e.target.value)} />
              </div>
            </div>
            <button className="adm-btn adm-btn-primary adm-btn-lg" type="submit" disabled={loading}
              style={{ width: '100%', justifyContent: 'center', opacity: loading ? 0.75 : 1, gap: '8px' }}>
              {loading && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  style={{ animation: 'spin 1s linear infinite' }}>
                  <circle cx="12" cy="12" r="10" strokeOpacity="0.3"/>
                  <path d="M12 2a10 10 0 0 1 10 10"/>
                  <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                </svg>
              )}
              {loading ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
