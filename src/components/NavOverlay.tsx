'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import styles from './NavOverlay.module.css';

// Nav links with associated preview images
const NAV_LINKS = [
  { href: '/',               label: 'Home',           img: '/images/home/hero/hero-home.jpg' },
  { href: '/forever-santai', label: 'Forever Santai', img: '/images/home/hero/hero-santai.jpg' },
  { href: '/forever-pandawa',label: 'Forever Pandawa',img: '/images/home/hero/hero-pandawa.jpg' },
  { href: '/journal',        label: 'The Journal',    img: '/images/home/hero/hero-journal.jpg' },
  { href: '/faq',            label: 'FAQ',            img: '/images/home/hero/hero-faq.jpg' },
];

// Replace img paths above with your actual per-page images
// e.g. '/images/villas/santai-cover.webp'

interface NavOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  contact: { email: string; phone: string; whatsapp: string };
  social: { instagram: string; facebook: string; youtube: string };
}

export default function NavOverlay({ isOpen, onClose, contact, social }: NavOverlayProps) {
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLLIElement[]>([]);
  const metaRef = useRef<HTMLDivElement>(null);

  // Which nav item is hovered — controls the image panel
  const [hoveredIdx, setHoveredIdx] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const animate = async () => {
      const { gsap } = await import('gsap');

      if (isOpen) {
        gsap.set(overlayRef.current, { display: 'flex', clipPath: 'inset(0 0 100% 0)' });
        gsap.set(linksRef.current, { opacity: 0, y: 32 });
        gsap.set(metaRef.current, { opacity: 0, y: 16 });

        gsap.to(overlayRef.current, {
          clipPath: 'inset(0 0 0% 0)',
          duration: 0.7,
          ease: 'power3.inOut',
        });

        gsap.to(linksRef.current, {
          opacity: 1, y: 0,
          duration: 0.55,
          stagger: 0.07,
          ease: 'power3.out',
          delay: 0.3,
        });

        gsap.to(metaRef.current, {
          opacity: 1, y: 0,
          duration: 0.5,
          ease: 'power3.out',
          delay: 0.55,
        });
      } else {
        gsap.to([linksRef.current, metaRef.current], {
          opacity: 0, y: -16,
          duration: 0.25,
          stagger: 0.03,
          ease: 'power2.in',
        });
        gsap.to(overlayRef.current, {
          clipPath: 'inset(0 0 100% 0)',
          duration: 0.55,
          ease: 'power3.inOut',
          delay: 0.1,
          onComplete: () => {
            if (overlayRef.current) overlayRef.current.style.display = 'none';
          },
        });
      }
    };

    animate();
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => { onClose(); }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      ref={overlayRef}
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
      style={{ display: 'none' }}
    >
      {/* ── Left: image panel ── */}
      <div className={styles.imgPanel}>
        {NAV_LINKS.map((link, i) => (
          <div
            key={i}
            className={`${styles.imgSlide} ${i === hoveredIdx ? styles.imgSlideActive : ''}`}
          >
            <Image
              src={link.img}
              alt={link.label}
              fill
              sizes="(max-width: 768px) 0vw, 40vw"
              quality={90}
              className={styles.imgSlideImg}
              priority={i === 0}
            />
          </div>
        ))}
        {/* Subtle gradient over image */}
        <div className={styles.imgGradient} />
      </div>

      {/* ── Right: content panel ── */}
      <div ref={rightRef} className={styles.rightPanel}>

        {/* Close */}
        <button className={styles.close} onClick={onClose} aria-label="Close menu">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        {/* Discover label */}
        <p className={styles.discoverLabel}>Discover Pages</p>

        {/* Nav links — 2-column grid */}
        <nav className={styles.nav}>
          <ul>
            {NAV_LINKS.map((link, i) => (
              <li
                key={link.href}
                ref={el => { if (el) linksRef.current[i] = el; }}
              >
                <Link
                  href={link.href}
                  className={`${styles.navLink} ${pathname === link.href ? styles.active : ''}`}
                  onClick={onClose}
                  onMouseEnter={() => setHoveredIdx(i)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom meta — contact + social + terms */}
        <div ref={metaRef} className={styles.meta}>
          {/* Contact */}
          <div className={styles.metaGroup}>
            <p className={styles.metaLabel}>Contact Us</p>
            <div className={styles.metaLinks}>
              <a href={`mailto:${contact.email}`} className={styles.metaLink}>
                {contact.email}
              </a>
              <span className={styles.metaSep}>|</span>
              <a href={`tel:${contact.whatsapp}`} className={styles.metaLink}>{contact.phone}</a>
            </div>
          </div>

          {/* Social */}
          <div className={styles.metaGroup}>
            <p className={styles.metaLabel}>Stay Connected</p>
            <div className={styles.socialRow}>
              <a href={social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={styles.socialIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
              <a href={social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className={styles.socialIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className={styles.socialIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </a>
              <a href={social.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className={styles.socialIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Terms */}
          <div className={styles.terms}>
            <Link href="/cancellation-policy" className={styles.termsLink} onClick={onClose}>
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
