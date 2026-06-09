import Link from 'next/link';
import { storageGet } from '@/lib/storage';

const VILLAS = [
  { slug: 'forever-pandawa', name: 'Forever Pandawa', desc: 'Clifftop villa overlooking Pandawa Beach', href: '/forever-pandawa' },
  { slug: 'forever-santai',  name: 'Forever Santai',  desc: 'Three-story luxury villa, newly renovated', href: '/forever-santai'  },
];

export default async function VillasIndexPage() {
  const content = await storageGet<Record<string, unknown>>('fbv:site-content', 'site-content.json');
  const villas = (content?.villas ?? {}) as Record<string, Record<string, unknown>>;

  return (
    <>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--adm-text)' }}>Villas</h1>
        <p style={{ fontSize: '0.8rem', color: 'var(--adm-muted)', marginTop: '2px' }}>
          Select a villa to edit its content, rooms, gallery, and images.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {VILLAS.map(v => {
          const data = villas[v.slug] ?? {};
          // Prefer featuredImage → heroImage → first gallery image
          const thumb = (data.featuredImage as string)
            || (data.heroImage as string)
            || ((data.galleryImages as string[])?.[0] ?? '');

          return (
            <div key={v.slug} className="adm-card" style={{ overflow: 'hidden' }}>
              <div style={{ height: '160px', background: '#e5e7eb', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {thumb ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={thumb} alt={v.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', color: '#9ca3af', fontSize: '0.75rem', textAlign: 'center', padding: '0 16px' }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                    Set a Featured Image in the editor
                  </div>
                )}
              </div>
              <div className="adm-card-body">
                <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--adm-text)', marginBottom: '4px' }}>{v.name}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--adm-muted)', marginBottom: '16px' }}>{v.desc}</div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Link href={`/admin/villas/${v.slug}`} className="adm-btn adm-btn-primary adm-btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
                    Edit Villa
                  </Link>
                  <Link href={v.href} target="_blank" className="adm-btn adm-btn-ghost adm-btn-sm">View ↗</Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
