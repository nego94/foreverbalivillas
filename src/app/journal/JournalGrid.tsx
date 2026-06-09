'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

interface Post { slug: string; title: string; coverImage: string; category?: string; }

const INITIAL  = 4;  // 1 featured + 3 in bottom row
const PER_LOAD = 6;

function PostCard({ post }: { post: Post }) {
  return (
    <Link href={`/journal/${post.slug}`} className={styles.card}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={post.coverImage} alt={post.title} className={styles.cardImg} />
      <div className={styles.cardOverlay} />
      <div className={styles.cardFooter}>
        <h3 className={styles.cardTitle}>{post.title}</h3>
        <span className={styles.readBtn}>Read More &nbsp;→</span>
      </div>
    </Link>
  );
}

function ThatsAll() {
  return (
    <div className={styles.thatsAllCard}>
      <p className={styles.thatsAllLabel}>The Journal</p>
      <p className={styles.thatsAllText}>
        You&rsquo;ve reached the end of our stories.<br />More coming soon.
      </p>
    </div>
  );
}

export default function JournalGrid({ posts }: { posts: Post[] }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [visible, setVisible]               = useState(INITIAL);

  const categories = ['All', ...Array.from(
    new Set(posts.map(p => p.category).filter((c): c is string => !!c))
  )];

  const filtered    = activeCategory === 'All' ? posts : posts.filter(p => p.category === activeCategory);
  const featured    = filtered[0];
  const shown       = filtered.slice(1, visible);        // posts shown after featured
  const bottomRow   = shown.slice(0, 3);                 // always up to 3 in the bottom row
  const extraPosts  = shown.slice(3);                    // revealed after Load More
  const hasMore     = visible < filtered.length;
  const bottomFull  = bottomRow.length === 3;            // all 3 bottom slots have posts

  const extraRows: Post[][] = [];
  for (let i = 0; i < extraPosts.length; i += 3) {
    extraRows.push(extraPosts.slice(i, i + 3));
  }

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setVisible(INITIAL);
  };

  return (
    <>
      {/* Filter tabs */}
      <div className={styles.filters}>
        <div className={styles.filterInner}>
          {categories.map(tab => (
            <button key={tab} onClick={() => handleCategoryChange(tab)}
              className={`${styles.filterBtn} ${activeCategory === tab ? styles.filterActive : ''}`}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      <section className={styles.postsSection}>
        {!featured ? (
          <p style={{ textAlign: 'center', padding: '80px 20px', color: '#888' }}>
            No posts in this category yet.
          </p>
        ) : (
          <>
            {/* Featured — full width */}
            <Link href={`/journal/${featured.slug}`} className={styles.featuredCard}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={featured.coverImage} alt={featured.title} className={styles.featuredImg} />
              <div className={styles.featuredOverlay} />
              <div className={styles.featuredFooter}>
                <h2 className={styles.featuredTitle}>{featured.title}</h2>
                <span className={styles.readBtn}>Read More &nbsp;→</span>
              </div>
            </Link>

            {/* Bottom row — always 3 columns */}
            <div className={styles.bottomRow}>
              {bottomRow.map(post => <PostCard key={post.slug} post={post} />)}

              {/* 3rd slot: That's All only when row isn't full (≤ 3 posts total) */}
              {!bottomFull && !hasMore && <ThatsAll />}
            </div>

            {/* Below the row: Load More button when row is full and more exist */}
            {bottomFull && hasMore && !extraRows.length && (
              <div className={styles.loadMoreCard} onClick={() => setVisible(v => v + PER_LOAD)}>
                <button className={styles.loadMoreBtn}>Load More</button>
              </div>
            )}

            {/* Below the row: That's All when row is full and nothing more */}
            {bottomFull && !hasMore && !extraRows.length && (
              <div className={styles.thatsAllCard} style={{ padding: '56px 24px' }}>
                <ThatsAll />
              </div>
            )}

            {/* Extra rows revealed by Load More */}
            {extraRows.map((row, ri) => (
              <div key={ri} className={styles.extraRow}>
                {row.map(post => <PostCard key={post.slug} post={post} />)}
              </div>
            ))}

            {/* After extra rows: Load More or That's All */}
            {extraRows.length > 0 && hasMore && (
              <div className={styles.loadMoreCard} style={{ minHeight: '100px' }}
                onClick={() => setVisible(v => v + PER_LOAD)}>
                <button className={styles.loadMoreBtn}>Load More</button>
              </div>
            )}
            {extraRows.length > 0 && !hasMore && (
              <div className={styles.thatsAllCard} style={{ padding: '48px 24px' }}>
                <ThatsAll />
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}
