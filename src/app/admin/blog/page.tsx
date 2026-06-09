import { getPosts } from '@/lib/admin-data';
import Link from 'next/link';
import BlogDeleteButton from './BlogDeleteButton';

export default async function BlogListPage() {
  const posts = (await getPosts()).sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--adm-text)' }}>Blog Posts</h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--adm-muted)', marginTop: '2px' }}>{posts.length} article{posts.length !== 1 ? 's' : ''}</p>
        </div>
        <Link href="/admin/blog/new" className="adm-btn adm-btn-primary">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New Post
        </Link>
      </div>

      <div className="adm-card">
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Slug</th>
                <th>Category</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.length === 0 && (
                <tr><td colSpan={5} style={{ color: '#9ca3af', textAlign: 'center', padding: '48px' }}>
                  No posts yet. <Link href="/admin/blog/new" style={{ color: 'var(--adm-accent)' }}>Create your first post →</Link>
                </td></tr>
              )}
              {posts.map(post => (
                <tr key={post.slug}>
                  <td style={{ fontWeight: 500, maxWidth: '240px' }}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.title}</div>
                    <div style={{ fontSize: '0.72rem', color: '#9ca3af', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.excerpt}</div>
                  </td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#6b7280' }}>{post.slug}</td>
                  <td>
                    {post.category
                      ? <span className="adm-badge adm-badge-blue">{post.category}</span>
                      : <span className="adm-badge adm-badge-gray">—</span>}
                  </td>
                  <td style={{ color: '#6b7280', whiteSpace: 'nowrap' }}>{post.date}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <Link href={`/journal/${post.slug}`} target="_blank" className="adm-btn adm-btn-ghost adm-btn-sm">View</Link>
                      <Link href={`/admin/blog/${post.slug}`} className="adm-btn adm-btn-ghost adm-btn-sm">Edit</Link>
                      <BlogDeleteButton slug={post.slug} />
                    </div>
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
