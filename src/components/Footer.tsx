'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from './Footer.module.css';

const scrollTop = () => window.scrollTo({ top: 0, behavior: 'instant' });

interface FooterProps {
  contact: { email: string; phone: string; whatsapp: string };
  social: { instagram: string; facebook: string; youtube: string };
}

export default function Footer({ contact, social }: FooterProps) {
  return (
    <footer className={styles.footer}>
      {/* Logo centered at top */}
      <div className={styles.logoRow}>
        <div className={styles.logoBlock}>
          <Image
            src="/images/logos/Logo_FBV.svg"
            alt="Forever Bali Villas"
            width={160}
            height={80}
            style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)' }}
            priority
          />
        </div>
      </div>

      {/* 4-column grid */}
      <div className={styles.grid}>
        {/* Contact */}
        <div className={styles.col}>
          <h4 className={styles.colHead}>Contact Us</h4>
          <a href={`mailto:${contact.email}`} className={styles.link}>
            {contact.email}
          </a>
          <a href={`tel:${contact.whatsapp}`} className={styles.link}>
            {contact.phone}
          </a>
        </div>

        {/* Navigation */}
        <div className={styles.col}>
          <nav aria-label="Footer navigation">
            <Link href="/forever-santai" className={styles.navLink} onClick={scrollTop}>FOREVER SANTAI</Link>
            <Link href="/forever-pandawa" className={styles.navLink} onClick={scrollTop}>FOREVER PANDAWA</Link>
            <Link href="/journal" className={styles.navLink} onClick={scrollTop}>THE JOURNAL</Link>
            <Link href="/faq" className={styles.navLink} onClick={scrollTop}>FAQ&apos;s</Link>
          </nav>
        </div>

        {/* Map — Google Maps embed, no API key required */}
        <div className={styles.col}>
          <div className={styles.mapWrap}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3942.416959910688!2d115.1894901!3d-8.8407149!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd25d8779cdee6f%3A0x7714793dac99b213!2sForever%20Pandawa%20by%20Forever%20Bali%20Villas!5e0!3m2!1sen!2sid!4v1777963726152!5m2!1sen!2sid"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Forever Bali Villas location"
            />
          </div>
        </div>

        {/* Addresses */}
        <div className={styles.col}>
          <div className={styles.addressBlock}>
            <div className={styles.addressHead}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
              </svg>
              <span className={styles.addressName}>Forever Santai</span>
            </div>
            <address className={styles.address}>
              Gapura Vista Residences · Jl. Pura Masang Kelod, Nusa Dua Selatan, Badung
            </address>
          </div>

          <div className={styles.addressBlock} style={{ marginTop: '16px' }}>
            <div className={styles.addressHead}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
              </svg>
              <span className={styles.addressName}>Forever Pandawa</span>
            </div>
            <address className={styles.address}>
              Gapura Vista Residences · Jl. Pura Masang Kelod, Nusa Dua Selatan, Badung
            </address>
          </div>
        </div>
      </div>

      {/* Social */}
      <div className={styles.social}>
        <p className={styles.socialLabel}>Stay Connected</p>
        <div className={styles.socialIcons}>
          {/* Facebook */}
          <a href={social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className={styles.socialIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>
          {/* WhatsApp */}
          <a href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className={styles.socialIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
          </a>
          {/* Instagram */}
          <a href={social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={styles.socialIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
            </svg>
          </a>
          {/* YouTube */}
          <a href={social.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className={styles.socialIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </a>
        </div>
      </div>

      {/* Bottom bar */}
      <div className={styles.bottom}>
        <span>{new Date().getFullYear()} © Forever Bali Villas All Rights Reserved.</span>
        <div className={styles.bottomLinks}>
          <Link href="/cancellation-policy" onClick={scrollTop}>Terms & Conditions</Link>
          <Link href="/privacy-policy" onClick={scrollTop}>Policy</Link>
        </div>
      </div>
    </footer>
  );
}
