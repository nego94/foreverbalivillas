'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import NavOverlay from './NavOverlay';
import styles from './Header.module.css';

// Pages with no dark hero at the top — header starts with dark elements immediately.
// FAQ and journal detail pages have dark hero images, so they are NOT here;
// they rely on the scrolled state to transition the header to dark.
const LIGHT_BG_PATHS = [
  '/cancellation-policy',
  '/privacy-policy',
];

const isLightBgPath = (path: string) =>
  LIGHT_BG_PATHS.some(p => path === p || path.startsWith(p + '/'));

interface HeaderProps {
  contact: { email: string; phone: string; whatsapp: string };
  social: { instagram: string; facebook: string; youtube: string };
  booking: { url: string };
}

export default function Header({ contact, social, booking }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const forcedLight = isLightBgPath(pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Prevent body scroll when nav is open
  useEffect(() => {
    document.body.style.overflow = navOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [navOpen]);

  const toggleNav = () => setNavOpen(prev => !prev);

  // Admin pages have their own shell — no site header needed
  if (pathname.startsWith('/admin')) return null;

  return (
    <>
      <header
        ref={headerRef}
        className={`${styles.header} ${scrolled ? styles.scrolled : ''} ${navOpen ? styles.navActive : ''} ${forcedLight ? styles.forcedLight : ''}`}
      >
        <div className={styles.inner}>
          {/* Left: nav group capsule = hamburger + FEATURES pill inside a bordered container */}
          <div className={styles.left}>
            <div className={styles.navGroup} onClick={toggleNav} role="button" aria-label={navOpen ? 'Close menu' : 'Open menu'} aria-expanded={navOpen}>
              <button
                className={styles.hamburger}
                tabIndex={-1}
                aria-hidden="true"
              >
                <span className={styles.bar} />
                <span className={styles.bar} />
              </button>
              <span className={styles.featuresLabel} aria-hidden="true">
                FEATURES
              </span>
            </div>
          </div>

          {/* Center: Logo */}
          <Link href="/" className={styles.logo} aria-label="Forever Bali Villas – Home">
            <Image
              src="/images/logos/Logo_FBV.svg"
              alt="Forever Bali Villas"
              width={200}
              height={100}
              style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)', width: '100%'}}
              className={styles.logoImg}
              priority
            />
          </Link>

          {/* Right: BOOK NOW */}
          <div className={styles.right}>
            <a
              href={booking.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.bookBtn}
            >
              BOOK NOW
            </a>
          </div>
        </div>
      </header>

      <NavOverlay isOpen={navOpen} onClose={() => setNavOpen(false)} contact={contact} social={social} />
    </>
  );
}
