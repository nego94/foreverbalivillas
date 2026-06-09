import type { Metadata } from 'next';
import { storageGet } from '@/lib/storage';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Terms & Conditions — Forever Bali Villas',
  description: 'Site usage agreement, service terms, booking, cancellation, refund policies, and conditions for Forever Bali Villas.',
};

type LegalPage = {
  pageTitle?: string;
  subtitle?: string;
  lastUpdated?: string;
  intro?: string;
  sections?: { title: string; body: string }[];
  footnote?: string;
};

export default async function TermsAndConditionsPage() {
  const siteContent = await storageGet<Record<string, unknown>>('fbv:site-content', 'site-content.json');
  const data = ((siteContent?.legal as Record<string, unknown>)?.terms ?? {}) as LegalPage;

  const pageTitle   = data.pageTitle   ?? 'Terms & Conditions';
  const subtitle    = data.subtitle    ?? 'Summary of Site Usage Agreement, Service Terms, and Conditions';
  const lastUpdated = data.lastUpdated ?? '';
  const intro       = data.intro       ?? '';
  const sections    = data.sections    ?? [];
  const footnote    = data.footnote    ?? '';

  return (
    <>
      <section style={{ padding: '140px 0 100px', minHeight: '60vh', background: 'var(--cream, #f9f3ec)' }}>
        <div className="container" style={{ maxWidth: '780px' }}>

          <h1 className="t-h1" style={{ marginBottom: '12px' }}>{pageTitle}</h1>
          <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: lastUpdated ? '8px' : '48px', fontFamily: 'var(--font-sans)' }}>
            {subtitle}
          </p>
          {lastUpdated && (
            <p style={{ color: '#aaa', fontSize: '0.78rem', marginBottom: '48px', fontFamily: 'var(--font-sans)' }}>
              Last updated: {lastUpdated}
            </p>
          )}

          {intro && (
            <p className="t-body" style={{ color: '#555', marginBottom: '40px', lineHeight: 1.85 }}>
              {intro}
            </p>
          )}

          {sections.map(({ title, body }) => (
            <div key={title} style={sectionStyle}>
              <h2 style={h2Style}>{title}</h2>
              <div className="legal-body" style={bodyStyle} dangerouslySetInnerHTML={{ __html: body }} />
            </div>
          ))}

          {footnote && (
            <div style={{ borderTop: '1px solid #ddd', paddingTop: '32px', marginTop: '48px' }}>
              <p style={{ color: '#999', fontSize: '0.78rem', fontFamily: 'var(--font-sans)', lineHeight: 1.7 }}>
                {footnote}
              </p>
            </div>
          )}

        </div>
      </section>
    </>
  );
}

const sectionStyle: React.CSSProperties = {
  marginBottom: '48px',
  paddingBottom: '40px',
  borderBottom: '1px solid #e8e0d8',
};

const h2Style: React.CSSProperties = {
  fontFamily: 'var(--font-sans)',
  fontSize: 'clamp(1.1rem, 2vw, 1.35rem)',
  fontWeight: 600,
  color: '#2a2420',
  marginBottom: '16px',
  letterSpacing: '0.01em',
};

const bodyStyle: React.CSSProperties = {
  fontFamily: 'var(--font-sans)',
  fontSize: '0.92rem',
  color: '#555',
  lineHeight: 1.85,
};
