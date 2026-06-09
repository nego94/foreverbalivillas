import Link from 'next/link';
import styles from './HomeFeatures.module.css';

const DEFAULT_FEATURES: { label: string; col: string; icon?: string }[] = [
  { label: '6 Bedrooms', col: 'left' },
  { label: 'Air Conditioning', col: 'right' },
  { label: '6 Bathrooms', col: 'left' },
  { label: 'TV Cable', col: 'right' },
  { label: 'Living Room', col: 'left' },
  { label: 'Free Wifi', col: 'right' },
  { label: 'Dining Room', col: 'left' },
  { label: 'Spa', col: 'right' },
  { label: 'Kitchen', col: 'left' },
  { label: 'Breakfast Private Chef', col: 'right' },
  { label: 'House Laundry', col: 'left' },
  { label: 'Fully Staffed', col: 'right' },
  { label: '24/7 Security', col: 'left' },
  { label: 'BBQ Facility', col: 'right' },
  { label: 'Gym', col: 'left' },
  { label: 'Private Infinity Pool', col: 'right' },
];

interface FeatureItem { label: string; col: string; icon?: string }

interface Props {
  features?: FeatureItem[];
  spaMenuUrl?: string;
  foodMenuUrl?: string;
}

export default function HomeFeatures({ features, spaMenuUrl, foodMenuUrl }: Props) {
  const FEATURES = features && features.length > 0 ? features : DEFAULT_FEATURES;
  const leftFeatures = FEATURES.filter(f => f.col === 'left');
  const rightFeatures = FEATURES.filter(f => f.col === 'right');
  const spaHref  = spaMenuUrl  || '#';
  const foodHref = foodMenuUrl || '#';

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.inner}>
          {/* Left: heading */}
          <div className={styles.headingCol} data-reveal>
            <div className={styles.headingText}>
              <h2 className={`t-h2 ${styles.title}`}>
                Key<br />
                Features<br />
                Per Villa
              </h2>
              <p className={styles.subtitle}>
                Forever Bali Villas<br />
                <em>at a glance</em>
              </p>
            </div>

            <div className={styles.menuBtns}>
              <Link href={spaHref} className={styles.menuBtn} target={spaMenuUrl ? '_blank' : undefined} rel={spaMenuUrl ? 'noopener noreferrer' : undefined}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 22c6-4 10-8.5 10-13a10 10 0 0 0-20 0c0 4.5 4 9 10 13z"/>
                </svg>
                Spa Menu
              </Link>
              <Link href={foodHref} className={styles.menuBtn} target={foodMenuUrl ? '_blank' : undefined} rel={foodMenuUrl ? 'noopener noreferrer' : undefined}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
                </svg>
                Food Menu
              </Link>
            </div>
          </div>

          {/* Right: feature table */}
          <div className={styles.featureTable} data-reveal>
            {leftFeatures.map((feat, i) => (
              <div key={feat.label} className={styles.featureRow}>
                <div className={styles.featureCell}>
                  {feat.icon
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={feat.icon} alt="" width={20} height={20} style={{ objectFit: 'contain', flexShrink: 0 }} />
                    : <span className={styles.dot} />}
                  <span>{feat.label}</span>
                </div>
                {rightFeatures[i] && (
                  <div className={styles.featureCell}>
                    {rightFeatures[i].icon
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <img src={rightFeatures[i].icon} alt="" width={20} height={20} style={{ objectFit: 'contain', flexShrink: 0 }} />
                      : <span className={styles.dot} />}
                    <span>{rightFeatures[i].label}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
