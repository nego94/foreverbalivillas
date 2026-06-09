import { getPosts } from '@/lib/admin-data';
import { getUsers } from '@/lib/admin-data';
import Link from 'next/link';
import DatabaseStatus from '@/components/admin/DatabaseStatus';

const PAGES = [
  { label: 'Homepage',           editHref: '/admin/pages?tab=homepage', href: '/',                    icon: '🏠', desc: 'Hero, gallery, about, features' },
  { label: 'FAQ',                editHref: '/admin/pages?tab=faq',      href: '/faq',                 icon: '❓', desc: 'Questions, hero, CTA' },
  { label: 'Forever Pandawa',    editHref: '/admin/villas/forever-pandawa', href: '/forever-pandawa', icon: '🏖', desc: 'Rooms, images, gallery' },
  { label: 'Forever Santai',     editHref: '/admin/villas/forever-santai',  href: '/forever-santai',  icon: '🌴', desc: 'Rooms, images, gallery' },
  { label: 'Terms & Conditions', editHref: '/admin/pages?tab=terms',   href: '/cancellation-policy', icon: '📋', desc: 'Policies, cancellation, check-in' },
  { label: 'Privacy Policy',     editHref: '/admin/pages?tab=privacy', href: '/privacy-policy',      icon: '🔒', desc: 'GDPR, data handling, cookies' },
];

export default async function DashboardPage() {
  const [posts, users] = await Promise.all([getPosts(), getUsers()]);
  const recentPosts = [...posts].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);

  return (
    <>
      <DatabaseStatus />

      {/* Stats */}
      <div className="adm-stats">
        <div className="adm-stat">
          <div className="adm-stat-label">Blog Posts</div>
          <div className="adm-stat-value">{posts.length}</div>
          <div className="adm-stat-sub">Total articles</div>
        </div>
        <div className="adm-stat">
          <div className="adm-stat-label">Admin Users</div>
          <div className="adm-stat-value">{users.length + 1}</div>
          <div className="adm-stat-sub">incl. env admin</div>
        </div>
        <div className="adm-stat">
          <div className="adm-stat-label">Pages</div>
          <div className="adm-stat-value">{PAGES.length}</div>
          <div className="adm-stat-sub">All editable</div>
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '28px', flexWrap: 'wrap' }}>
        <Link href="/admin/blog/new" className="adm-btn adm-btn-primary">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New Blog Post
        </Link>
        <Link href="/admin/pages" className="adm-btn adm-btn-ghost">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="12" y2="17"/></svg>
          Edit Pages
        </Link>
        <Link href="/admin/media" className="adm-btn adm-btn-ghost">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          Media Library
        </Link>
        <Link href="/admin/settings" className="adm-btn adm-btn-ghost">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          Settings
        </Link>
      </div>

      {/* Pages overview */}
      <div className="adm-card" style={{ marginBottom: '24px' }}>
        <div className="adm-card-header">
          <span className="adm-card-title">Site Pages</span>
          <Link href="/admin/pages" className="adm-btn adm-btn-ghost adm-btn-sm">Open Editor</Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px', padding: '16px' }}>
          {PAGES.map(page => (
            <div key={page.label} style={{ border: '1px solid var(--adm-border)', borderRadius: '10px', padding: '14px 16px', background: '#fafafa' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                <div>
                  <div style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{page.icon}</div>
                  <div style={{ fontWeight: 600, fontSize: '0.84rem', color: 'var(--adm-text)', marginBottom: '2px' }}>{page.label}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--adm-muted)' }}>{page.desc}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '6px', marginTop: '12px' }}>
                <Link
                  href={page.editHref}
                  className="adm-btn adm-btn-ghost adm-btn-sm"
                  style={{ fontSize: '0.72rem', flex: 1, justifyContent: 'center' }}
                >
                  Edit
                </Link>
                <Link
                  href={page.href}
                  target="_blank"
                  className="adm-btn adm-btn-ghost adm-btn-sm"
                  style={{ fontSize: '0.72rem' }}
                >
                  ↗
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent posts */}
      <div className="adm-card">
        <div className="adm-card-header">
          <span className="adm-card-title">Recent Blog Posts</span>
          <Link href="/admin/blog" className="adm-btn adm-btn-ghost adm-btn-sm">View all</Link>
        </div>
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentPosts.length === 0 && (
                <tr><td colSpan={4} style={{ color: '#9ca3af', textAlign: 'center', padding: '32px' }}>No posts yet</td></tr>
              )}
              {recentPosts.map(post => (
                <tr key={post.slug}>
                  <td style={{ fontWeight: 500 }}>{post.title}</td>
                  <td><span className="adm-badge adm-badge-blue">{post.category || '—'}</span></td>
                  <td style={{ color: '#6b7280' }}>{post.date}</td>
                  <td>
                    <Link href={`/admin/blog/${post.slug}`} className="adm-btn adm-btn-ghost adm-btn-sm">Edit</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
