import Image from 'next/image';
import styles from './HomeAmenities.module.css';

const DEFAULT_AMENITIES = [
  { label: 'Luxury\nAccommodations', icon: '/images/icons/luxury.svg' },
  { label: 'SPA',                    icon: '/images/icons/spa.svg' },
  { label: 'Personal\nChef',         icon: '/images/icons/chef.svg' },
  { label: 'Pool',                   icon: '/images/icons/pool.svg' },
  { label: 'On Demand\nServices',    icon: '/images/icons/on-demand.svg' },
];

const DEFAULT_HEADING = 'About Us';
const DEFAULT_BODY = [
  'Forever Bali Villas is a curated collection of owner-operated luxury villas designed for elevated stays in Bali. We have 2 stunning villas located overlooking Pandawa Beach, Forever Santai and Forever Pandawa.',
  'Both our properties offer privacy, sweeping ocean views, and easy access to one of the island\'s most beautiful coastlines.',
  'Each villa features six spacious bedrooms, six bathrooms, expansive living areas, a fully equipped kitchen, private infinity pool, and dedicated staff, with private chef services available on request. Perfect for retreats, intimate events, group celebrations, and family holidays, we combine genuine Balinese hospitality with refined comfort, creating stays that feel both exclusive and effortless.',
].join('\n\n');

interface AmenityItem { label: string; icon: string; }

interface Props {
  heading?: string;
  body?: string;
  amenities?: AmenityItem[];
}

export default function HomeAmenities({ heading, body, amenities }: Props) {
  const title = heading || DEFAULT_HEADING;
  const paragraphs = (body || DEFAULT_BODY).split('\n\n').filter(Boolean);
  const icons = amenities && amenities.length > 0 ? amenities : DEFAULT_AMENITIES;

  return (
    <section className={styles.section}>
      <div className={styles.topLine} />

      <div className="container">
        <h2 className={`t-h2 ${styles.heading}`} data-reveal>{title}</h2>

        {/* Icon row */}
        <div className={styles.icons} data-reveal>
          {icons.map((a, idx) => (
            <div key={idx} className={styles.iconItem}>
              <div className={styles.iconSvg}>
                <Image
                  src={a.icon}
                  alt={a.label.replace('\n', ' ')}
                  width={44}
                  height={44}
                  style={{ objectFit: 'contain' }}
                  unoptimized
                />
              </div>
              <span className={`t-label ${styles.iconLabel}`}>
                {a.label.split('\n').map((line, i) => (
                  <span key={i}>{line}<br /></span>
                ))}
              </span>
            </div>
          ))}
        </div>

        {/* Description paragraphs */}
        <div className={styles.desc} data-reveal>
          {paragraphs.map((para, i) => (
            <p key={i} style={i > 0 ? { marginTop: '1.2em' } : undefined}>{para}</p>
          ))}
        </div>
      </div>

      <div className={styles.bottomLine} />
    </section>
  );
}
