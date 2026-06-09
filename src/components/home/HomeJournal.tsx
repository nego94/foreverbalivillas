import Link from 'next/link';
import Image from 'next/image';
import styles from './HomeJournal.module.css';

interface Post { slug: string; title: string; coverImage: string; }

export default function HomeJournal({ posts }: { posts: Post[] }) {
  const [featured, second, third] = posts;

  return (
    <section className={styles.section} aria-label="The Journal">

      {/* ── "The Journal" title banner with tile pattern ── */}
      <div className={styles.banner}>
        <div className={styles.bannerBg} />
        <div className={styles.bannerOverlay} />
        <div className={styles.bannerContent}>
          <h2 className={`t-hero ${styles.bannerTitle}`}>The Journal</h2>
        </div>
      </div>

      {/* ── Blog card grid: 1 big + 2 side-by-side ── */}
      <div className={styles.grid}>

        {/* Top: big full-width featured card */}
        {featured && (
          <Link href={`/journal/${featured.slug}`} className={styles.cardFeatured} data-reveal>
            {/* Explicit image wrapper — ensures fill works regardless of parent tag */}
            <div className={styles.imgWrap}>
              <Image
                src={featured.coverImage}
                alt={featured.title}
                fill
                sizes="100vw"
                quality={85}
                className={styles.cardImg}
              />
            </div>
            <div className={styles.cardOverlay} />
            <div className={styles.cardBody}>
              <h3 className={styles.cardTitle}>{featured.title}</h3>
              <span className={styles.viewMore}>VIEW MORE</span>
            </div>
          </Link>
        )}

        {/* Bottom row: two equal cards */}
        <div className={styles.cardRow}>
          {second && (
            <Link href={`/journal/${second.slug}`} className={styles.cardHalf} data-reveal>
              <div className={styles.imgWrap}>
                <Image
                  src={second.coverImage}
                  alt={second.title}
                  fill
                  sizes="50vw"
                  quality={85}
                  className={styles.cardImg}
                />
              </div>
              <div className={styles.cardOverlay} />
              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{second.title}</h3>
                <span className={styles.viewMore}>VIEW MORE</span>
              </div>
            </Link>
          )}

          {third && (
            <Link href={`/journal/${third.slug}`} className={styles.cardHalf} data-reveal>
              <div className={styles.imgWrap}>
                <Image
                  src={third.coverImage}
                  alt={third.title}
                  fill
                  sizes="50vw"
                  quality={85}
                  className={styles.cardImg}
                />
              </div>
              <div className={styles.cardOverlay} />
              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{third.title}</h3>
                <span className={styles.viewMore}>VIEW MORE</span>
              </div>
            </Link>
          )}
        </div>
      </div>

    </section>
  );
}
