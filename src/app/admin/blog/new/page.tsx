'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CategorySelect from '../CategorySelect';
import ImageField from '@/components/admin/ImageField';

export default function NewPostPage() {
  const router = useRouter();
  const today = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState({
    title: '', slug: '', excerpt: '', body: '', coverImage: '',
    category: '', date: today,
    gallery: ['', '', ''],
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  const setGallery = (i: number, v: string) => setForm(f => { const g = [...f.gallery]; g[i] = v; return { ...f, gallery: g }; });

  const autoSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').slice(0, 60);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const body = { ...form, gallery: form.gallery.filter(Boolean) };
    try {
      const res = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed to create post'); return; }
      router.push('/admin/blog');
      router.refresh();
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
        <h1 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--adm-text)' }}>New Blog Post</h1>
      </div>

      {error && <div className="adm-alert adm-alert-error">{error}</div>}

      <form onSubmit={submit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px', alignItems: 'start' }}>
          {/* Main */}
          <div className="adm-card adm-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            <div className="adm-form-group">
              <label className="adm-label">Title <span style={{ color: '#e53e3e' }}>*</span></label>
              <input className="adm-input" value={form.title} onChange={e => { set('title', e.target.value); if (!form.slug) set('slug', autoSlug(e.target.value)); }} required />
            </div>
            <div className="adm-form-group">
              <label className="adm-label">Slug <span style={{ color: '#e53e3e' }}>*</span> <span className="adm-label-hint">URL: /journal/your-slug</span></label>
              <input className="adm-input" style={{ fontFamily: 'monospace', fontSize: '0.82rem' }} value={form.slug} onChange={e => set('slug', e.target.value)} required />
            </div>
            <div className="adm-form-group">
              <label className="adm-label">Excerpt <span className="adm-label-hint">shown in listings</span></label>
              <textarea className="adm-textarea" rows={3} value={form.excerpt} onChange={e => set('excerpt', e.target.value)} placeholder="Short description shown in listings…" />
            </div>
            <div className="adm-form-group">
              <label className="adm-label">Article Body <span className="adm-label-hint">separate paragraphs with a blank line — gallery splits the content in half</span></label>
              <textarea className="adm-textarea" rows={12} value={form.body} onChange={e => set('body', e.target.value)}
                placeholder={"First paragraph here.\n\nSecond paragraph here.\n\n[Gallery images appear in the middle automatically]\n\nThird paragraph here.\n\nFourth paragraph here."} />
            </div>
            <ImageField
              label="Cover Image"
              hint="shown in blog listings and article hero"
              value={form.coverImage}
              onChange={v => set('coverImage', v)}
              folder="blog"
              aspect="16/9"
            />

            <div className="adm-form-group" style={{ marginBottom: 0 }}>
              <label className="adm-label">Gallery Images <span className="adm-label-hint">appear inside the article body</span></label>
              {form.gallery.map((g, i) => (
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

          {/* Sidebar */}
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

            <button className="adm-btn adm-btn-primary adm-btn-lg" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
              {loading ? 'Publishing…' : 'Publish Post'}
            </button>
            <Link href="/admin/blog" className="adm-btn adm-btn-ghost" style={{ width: '100%', justifyContent: 'center', textDecoration: 'none' }}>
              Cancel
            </Link>
          </div>
        </div>
      </form>
    </>
  );
}
