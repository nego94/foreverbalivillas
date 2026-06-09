import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import NewsletterStrip from '@/components/NewsletterStrip';
import { getPosts } from '@/lib/admin-data';
import styles from './page.module.css';

export const revalidate = 60;

const FALLBACK_BODY = 'The full article content will appear here once added via the admin panel at /admin/blog.';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const posts = await getPosts();
  const post = posts.find(p => p.slug === slug);
  if (!post) return { title: 'Post Not Found' };
  return {
    title: post.title,
    description: (post.excerpt || '').slice(0, 160),
  };
}

export default async function JournalPostPage({ params }: Props) {
  const { slug } = await params;
  const posts = await getPosts();
  const published = posts.filter(p => p.published !== false);
  const idx  = published.findIndex(p => p.slug === slug);
  const post = published[idx];

  if (!post) notFound();

  const prev = idx > 0                   ? published[idx - 1] : null;
  const next = idx < published.length - 1 ? published[idx + 1] : null;

  const rawBody = post.body || '';
  const paragraphs = rawBody.trim()
    ? rawBody.split(/\n\n+/).map(p => p.replace(/\n/g, ' ').trim()).filter(Boolean)
    : [post.excerpt || FALLBACK_BODY];

  const half = Math.ceil(paragraphs.length / 2);

  return (
    <>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroBg} style={{ backgroundImage: `url(${post.coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className={styles.heroOverlay} />
        <div className={`container ${styles.heroContent}`}>
          <p className={`t-label ${styles.category}`}>{post.category}</p>
          <h1 className={`t-h1 ${styles.heroTitle}`}>{post.title}</h1>
        </div>
      </section>

      {/* Article */}
      <article className={styles.article}>
        <div className={`container ${styles.articleInner}`}>
          {paragraphs.slice(0, half).map((p, i) => (
            <p key={i} className={`t-body ${styles.bodyText}`}>{p}</p>
          ))}

          {post.gallery && post.gallery.length > 0 && (
            <div className={styles.galleryGrid}>
              {post.gallery.map((img, i) => (
                <div key={i} className={styles.galleryImageWrap}>
                  <img src={img} alt={`${post.title} gallery ${i + 1}`} className={styles.galleryImage} />
                </div>
              ))}
            </div>
          )}

          {paragraphs.slice(half).map((p, i) => (
            <p key={i} className={`t-body ${styles.bodyText}`}>{p}</p>
          ))}

          <hr className={styles.divider} />

          {/* Share */}
          <div className={styles.share}>
            <p className={`t-label ${styles.shareLabel}`}>Share this blog:</p>
            <div className={styles.shareIcons}>
              <a href="#" aria-label="Share on Instagram" className={styles.shareIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
              <a href="#" aria-label="Share on Facebook" className={styles.shareIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" aria-label="Share on X (Twitter)" className={styles.shareIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </article>

      {/* More Stories — prev/next navigation */}
      {(prev || next) && (
        <nav className={styles.moreStories}>
          <p className={styles.moreLabel}>More Stories</p>
          <div className={styles.moreGrid}>
            {prev ? (
              <Link href={`/journal/${prev.slug}`} className={styles.moreCard}>
                <div className={styles.moreCardBg} style={{ backgroundImage: `url(${prev.coverImage})` }} />
                <div className={styles.moreCardOverlay} />
                <div className={styles.moreCardBody}>
                  <span className={styles.moreDirection}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
                    Previous
                  </span>
                  <p className={styles.moreTitle}>{prev.title}</p>
                </div>
              </Link>
            ) : (
              <div />
            )}
            {next ? (
              <Link href={`/journal/${next.slug}`} className={`${styles.moreCard} ${styles.moreCardRight}`}>
                <div className={styles.moreCardBg} style={{ backgroundImage: `url(${next.coverImage})` }} />
                <div className={styles.moreCardOverlay} />
                <div className={styles.moreCardBody}>
                  <span className={styles.moreDirection}>
                    Next
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                  </span>
                  <p className={styles.moreTitle}>{next.title}</p>
                </div>
              </Link>
            ) : (
              <div />
            )}
          </div>
          <div className={styles.backToJournal}>
            <Link href="/journal" className={styles.backToJournalLink}>
              View all stories
            </Link>
          </div>
        </nav>
      )}

      {!(prev || next) && (
        <div className={styles.backToJournal} style={{ padding: '48px 0' }}>
          <Link href="/journal" className={styles.backToJournalLink}>
            ← Back to The Journal
          </Link>
        </div>
      )}

      <NewsletterStrip />
    </>
  );
}
