'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './CookieConsent.module.css';

const STORAGE_KEY = 'fbv_cookie_consent';
type Phase = 'idle' | 'banner' | 'closing' | 'mini';


export default function CookieConsent() {
  const [phase, setPhase] = useState<Phase>('idle');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setPhase('mini');
    } else {
      const t = setTimeout(() => setPhase('banner'), 1200);
      return () => clearTimeout(t);
    }
  }, []);

  const choose = (value: 'accepted' | 'declined') => {
    localStorage.setItem(STORAGE_KEY, value);
    setPhase('closing');
    setTimeout(() => setPhase('mini'), 420);
  };

  if (phase === 'idle') return null;

  if (phase === 'mini') {
    return (
      <button
        className={styles.miniBtn}
        onClick={() => setPhase('banner')}
        aria-label="Cookie preferences"
        title="Cookie preferences"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      </button>
    );
  }

  return (
    <div
      className={`${styles.banner} ${phase === 'closing' ? styles.bannerClosing : ''}`}
      role="dialog"
      aria-label="Cookie consent"
    >
      <div className={styles.dot} aria-hidden="true" />
      <div className={styles.text}>
        <p className={styles.title}>Cookies &amp; Privacy</p>
        <p className={styles.body}>
          We use cookies to improve your experience and analyse site traffic.{' '}
          <Link href="/privacy-policy" className={styles.link}>Learn more</Link>
        </p>
      </div>
      <div className={styles.actions}>
        <button className={styles.btnDecline} onClick={() => choose('declined')}>Decline</button>
        <button className={styles.btnAccept} onClick={() => choose('accepted')}>Accept</button>
      </div>
    </div>
  );
}
