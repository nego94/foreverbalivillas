import type { Metadata } from 'next';
import NewsletterStrip from '@/components/NewsletterStrip';
import { getPosts } from '@/lib/admin-data';
import JournalGrid from './JournalGrid';
import styles from './page.module.css';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'The Journal — Stories, Travel Guides & Culture',
  description:
    'Dive into the soul of Bali. Lifestyle stories, travel guides, and cultural insights from the team behind Forever Bali Villas.',
};

export default async function JournalPage() {
  const allPosts = await getPosts();
  const published = allPosts.filter(p => p.published !== false);

  return (
    <>
      {/* Hero — uses first post cover as background */}
      <section className={styles.hero}>
        {published[0]?.coverImage && (
          <div className={styles.heroImg}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={published[0].coverImage} alt="The Journal" className={styles.heroBgImg} />
          </div>
        )}
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>The Journal</h1>
        </div>
      </section>

      {/* Grid with filter tabs + Load More — client component */}
      <JournalGrid posts={published} />

      <NewsletterStrip />
    </>
  );
}
