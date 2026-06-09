'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './HomeHero.module.css';

export default function HomeHero({ heroImage }: { heroImage?: string }) {
  const ctasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const init = async () => {
      const { gsap } = await import('gsap');
      if (!ctasRef.current) return;

      gsap.fromTo(
        ctasRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.5 }
      );
    };
    init();
  }, []);

  return (
    <section className={styles.hero} aria-label="Hero">
      {/* Hero image background — place hero-bg.webp in public/images/home/hero/ */}
      <div className={styles.imageBg}>
        <Image
          src={heroImage || "/images/home/hero/hero-bg.webp"}
          alt="Forever Bali Villas hero background"
          fill
          priority
          quality={90}
          className={styles.heroBgImage}
          sizes="100vw"
        />
      </div>

      <div className={styles.overlay} />

      {/* Centered CTA buttons only */}
      <div ref={ctasRef} className={styles.ctas} style={{ opacity: 0 }}>
        <Link href="/forever-santai" className="btn btn-outline">
          Forever Santai
        </Link>
        <Link href="/forever-pandawa" className="btn btn-outline">
          Forever Pandawa
        </Link>
      </div>

      <div className={styles.scrollIndicator} aria-hidden="true">
        <span className={styles.scrollText}>Scroll to learn more</span>
        <span className={styles.scrollLine} />
      </div>
    </section>
  );
}
