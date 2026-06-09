'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';
import styles from './VillaGalleryTestimonies.module.css';

function GalleryLightbox({ images, startIdx, onClose }: { images: string[]; startIdx: number; onClose: () => void }) {
  const [idx, setIdx] = useState(startIdx);
  const touchStartX = useRef(0);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') setIdx(i => Math.max(0, i - 1));
      if (e.key === 'ArrowRight') setIdx(i => Math.min(images.length - 1, i + 1));
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [images.length, onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.body.classList.add('cursor-suppressed');
    return () => {
      document.body.style.overflow = '';
      document.body.classList.remove('cursor-suppressed');
    };
  }, []);

  return (
    <div className={styles.lightbox} onClick={onClose} role="dialog" aria-modal="true">
      <button className={styles.lightboxClose} onClick={onClose} aria-label="Close">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <div
        className={styles.lightboxContent}
        onClick={e => e.stopPropagation()}
        onTouchStart={e => { touchStartX.current = e.touches[0].clientX; }}
        onTouchEnd={e => {
          const dx = e.changedTouches[0].clientX - touchStartX.current;
          if (Math.abs(dx) > 50) {
            if (dx > 0) setIdx(i => Math.max(0, i - 1));
            else setIdx(i => Math.min(images.length - 1, i + 1));
          }
        }}
      >
        <Image key={idx} src={images[idx]} alt={`Gallery image ${idx + 1}`} fill className={styles.lightboxImg} sizes="100vw" />
      </div>

      {idx > 0 && (
        <button className={`${styles.lightboxNav} ${styles.lightboxNavPrev}`} onClick={e => { e.stopPropagation(); setIdx(i => i - 1); }} aria-label="Previous">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
        </button>
      )}
      {idx < images.length - 1 && (
        <button className={`${styles.lightboxNav} ${styles.lightboxNavNext}`} onClick={e => { e.stopPropagation(); setIdx(i => i + 1); }} aria-label="Next">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
        </button>
      )}
      {images.length > 1 && (
        <div className={styles.lightboxCounter} onClick={e => e.stopPropagation()}>{idx + 1} / {images.length}</div>
      )}
    </div>
  );
}

export interface TestimonyData {
  id: number | string;
  rating: number;
  text: string;
  author: string;
  age: number | string;
}

const DEFAULT_TESTIMONIES: TestimonyData[] = [
  {
    id: 1,
    rating: 5,
    text: "Waking up to the sound of the ocean every morning was pure magic. The villa staff anticipated every need before we even asked — truly world-class hospitality.",
    author: "Sarah M.",
    age: 34,
  },
  {
    id: 2,
    rating: 5,
    text: "We celebrated our anniversary here and it exceeded every expectation. The private pool, the sunset views, the breakfast spread — everything was flawless.",
    author: "James & Lisa",
    age: 41,
  },
  {
    id: 3,
    rating: 5,
    text: "Forever Pandawa felt like our own private corner of Bali. The architecture is stunning and the team made us feel completely at home. Already planning our return.",
    author: "Nico B.",
    age: 29,
  },
  {
    id: 4,
    rating: 5,
    text: "The level of privacy and tranquility here is unmatched. After a week of exploring Bali, coming back to the villa each evening felt like a true retreat.",
    author: "Priya K.",
    age: 37,
  },
  {
    id: 5,
    rating: 5,
    text: "From the seamless check-in to the thoughtful little touches throughout our stay, this is exactly what a luxury villa experience should feel like.",
    author: "Tom & Rachel",
    age: 45,
  },
];

interface Props {
  images?: string[];
  testimonies?: TestimonyData[];
}

// ─── Gallery momentum drag ────────────────────────────────────────────────────
function useDrag(trackRef: React.RefObject<HTMLDivElement>) {
  const dragging = useRef(false);
  const startX = useRef(0);
  const startScroll = useRef(0);
  const prevX = useRef(0);
  const vel = useRef(0);
  const raf = useRef(0);
  const dragDist = useRef(0);

  const fling = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const speed = vel.current * 0.92;
    if (Math.abs(speed) < 0.5) return;
    el.scrollLeft += speed;
    vel.current = speed;
    raf.current = requestAnimationFrame(fling);
  }, [trackRef]);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    const el = trackRef.current;
    if (!el) return;
    cancelAnimationFrame(raf.current);
    dragging.current = true;
    startX.current = e.clientX;
    startScroll.current = el.scrollLeft;
    prevX.current = e.clientX;
    vel.current = 0;
    dragDist.current = 0;
    // No setPointerCapture — keeping it allows click events to fire on child slides
  }, [trackRef]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current || !trackRef.current) return;
    const dx = e.clientX - startX.current;
    trackRef.current.scrollLeft = startScroll.current - dx;
    vel.current = prevX.current - e.clientX;
    dragDist.current = Math.abs(dx);
    prevX.current = e.clientX;
  }, [trackRef]);

  const onPointerUp = useCallback(() => {
    if (!dragging.current) return;
    dragging.current = false;
    raf.current = requestAnimationFrame(fling);
  }, [fling]);

  return { onPointerDown, onPointerMove, onPointerUp, dragDist };
}

export default function VillaGalleryTestimonies({ images = [], testimonies = DEFAULT_TESTIMONIES }: Props) {
  const trackRef = useRef<HTMLDivElement>(null!);
  const testTrackRef = useRef<HTMLDivElement>(null!);

  const n = testimonies.length;
  const extendedImages = [...images, ...images, ...images, ...images, ...images];
  // Triple testimonies for seamless infinite loop
  const extendedTestimonies = [...testimonies, ...testimonies, ...testimonies];

  // rawIdx = index (in extended array) of the leftmost fully-visible card
  const [rawIdx, setRawIdx] = useState(n);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const lbTouchStartX = useRef(0);

  // Mouse-only drag state for testimonies
  const testDragging = useRef(false);
  const testStartX = useRef(0);
  const testStartScroll = useRef(0);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 900);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Gallery drag
  const { dragDist: galleryDragDist, ...galleryDrag } = useDrag(trackRef);

  // Gallery: init to middle copy + infinite loop on scroll
  useEffect(() => {
    const el = trackRef.current;
    if (!el || images.length === 0) return;
    const firstChild = el.children[0] as HTMLElement | undefined;
    if (!firstChild) return;
    const slideW = firstChild.clientWidth + 16;
    el.scrollLeft = slideW * images.length * 2;
  }, [images.length]);

  const handleGalleryScroll = () => {
    const el = trackRef.current;
    if (!el || images.length === 0) return;
    const firstChild = el.children[0] as HTMLElement | undefined;
    if (!firstChild) return;
    const slideW = firstChild.clientWidth + 16;
    const single = slideW * images.length;
    if (el.scrollLeft < single) el.scrollLeft += single * 2;
    else if (el.scrollLeft > single * 4) el.scrollLeft -= single * 2;
  };

  // Testimonies: init scroll to start of middle copy
  useEffect(() => {
    const el = testTrackRef.current;
    if (!el) return;
    const init = () => {
      const firstChild = el.children[0] as HTMLElement | undefined;
      if (!firstChild) return;
      const cardW = firstChild.clientWidth + 16;
      if (cardW > 0) {
        el.scrollLeft = cardW * n;
        setRawIdx(n);
      }
    };
    requestAnimationFrame(init);
  }, [n]);

  // Testimonies scroll: track position + silent jump for infinite loop
  const handleTestScroll = () => {
    const el = testTrackRef.current;
    if (!el) return;
    const firstChild = el.children[0] as HTMLElement | undefined;
    if (!firstChild) return;
    const cardW = firstChild.clientWidth + 16;
    if (cardW <= 0) return;

    const cur = Math.round(el.scrollLeft / cardW);
    setRawIdx(cur);

    // Silent jump: keep scroll within the middle copy's neighbourhood
    const single = cardW * n;
    if (el.scrollLeft < single * 0.4) {
      el.scrollLeft += single;
    } else if (el.scrollLeft > single * 2.6) {
      el.scrollLeft -= single;
    }
  };

  // ── Button nav ──
  const prevSlide = () => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: -((el.children[0] as HTMLElement)?.clientWidth + 16 || 0), behavior: 'smooth' });
  };
  const nextSlide = () => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: (el.children[0] as HTMLElement)?.clientWidth + 16 || 0, behavior: 'smooth' });
  };
  const prevTest = () => {
    const el = testTrackRef.current;
    if (!el) return;
    el.scrollBy({ left: -((el.children[0] as HTMLElement)?.clientWidth + 16 || 0), behavior: 'smooth' });
  };
  const nextTest = () => {
    const el = testTrackRef.current;
    if (!el) return;
    el.scrollBy({ left: (el.children[0] as HTMLElement)?.clientWidth + 16 || 0, behavior: 'smooth' });
  };

  // ── Mouse-only drag for testimonies ──
  const onTestPointerDown = useCallback((e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    const el = testTrackRef.current;
    if (!el) return;
    testDragging.current = true;
    testStartX.current = e.clientX;
    testStartScroll.current = el.scrollLeft;
    e.currentTarget.setPointerCapture(e.pointerId);
    el.style.scrollSnapType = 'none';
  }, []);

  const onTestPointerMove = useCallback((e: React.PointerEvent) => {
    if (!testDragging.current || e.pointerType !== 'mouse') return;
    const el = testTrackRef.current;
    if (!el) return;
    el.scrollLeft = testStartScroll.current - (e.clientX - testStartX.current);
  }, []);

  const onTestPointerUp = useCallback(() => {
    if (!testDragging.current) return;
    testDragging.current = false;
    const el = testTrackRef.current;
    if (!el) return;
    el.style.scrollSnapType = '';
    const firstChild = el.children[0] as HTMLElement | undefined;
    if (!firstChild) return;
    const cardW = firstChild.clientWidth + 16;
    if (cardW > 0) {
      const target = Math.round(el.scrollLeft / cardW) * cardW;
      el.scrollTo({ left: target, behavior: 'smooth' });
    }
  }, []);

  if (!images || images.length === 0) return null;

  return (
    <section className={styles.section}>
      {/* ── GALLERY ── */}
      <div className={styles.carouselContainer}>
        <button className={`${styles.navBtn} ${styles.navBtnLeft}`} onClick={prevSlide} aria-label="Previous image">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div className={styles.trackWrapper}>
          <div
            className={styles.track}
            ref={trackRef}
            onScroll={handleGalleryScroll}
            {...galleryDrag}
            style={{ cursor: 'grab', userSelect: 'none' }}
          >
            {extendedImages.map((src, idx) => (
              <div key={idx} className={styles.slide} onClick={() => { if (galleryDragDist.current < 8) setLightboxIdx(idx % images.length); }}>
                <Image
                  src={src}
                  alt={`Gallery Image ${(idx % images.length) + 1}`}
                  fill
                  className={styles.slideImg}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>

        <button className={`${styles.navBtn} ${styles.navBtnRight}`} onClick={nextSlide} aria-label="Next image">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* ── TESTIMONIES ── */}
      <div className={`container ${styles.testimoniesContainer}`}>
        <div className={styles.testimoniesHeader}>
          <h2 className={`t-h2 ${styles.testimoniesTitle}`}>Testimonies</h2>
          <div className={styles.testNavBtns}>
            <button className={styles.testNavBtn} onClick={prevTest} aria-label="Previous testimony">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button className={styles.testNavBtn} onClick={nextTest} aria-label="Next testimony">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>

        <div className={styles.testimoniesTrackWrapper}>
          <div
            className={styles.testimoniesTrack}
            ref={testTrackRef}
            onScroll={handleTestScroll}
            onPointerDown={onTestPointerDown}
            onPointerMove={onTestPointerMove}
            onPointerUp={onTestPointerUp}
            onPointerCancel={onTestPointerUp}
            style={{ cursor: 'grab' }}
          >
            {extendedTestimonies.map((t, idx) => {
              // Active = middle of 3 visible on desktop, leftmost on mobile
              const isActive = isMobile ? rawIdx === idx : rawIdx + 1 === idx;
              return (
                <div key={idx} className={`${styles.testimonyCard} ${isActive ? styles.testimonyCardActive : ''}`}>
                  <div className={styles.quoteIcon}>
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="var(--gray-light)" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.5 }}>
                      <path d="M9.983 3v7.391C9.983 16.095 6.252 19.961 3 21l-1.542-2.735c2.222-1.05 4.39-3.238 4.39-6.39v-.484H2V3h7.983zm12.017 0v7.391c0 5.704-3.731 9.57-6.983 10.609l-1.542-2.735c2.222-1.05 4.39-3.238 4.39-6.39v-.484h-3.834V3h7.967z" />
                    </svg>
                  </div>
                  <div className={styles.stars}>
                    {[...Array(t.rating)].map((_, i) => (
                      <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#ECA23B">
                        <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                      </svg>
                    ))}
                  </div>
                  <p className={styles.testimonyText}>{t.text}</p>
                  <div className={styles.authorRow}>
                    <div className={styles.authorAvatar}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </div>
                    <span className={styles.authorName}>{t.author}, {t.age}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── LIGHTBOX ── */}
      {lightboxIdx !== null && (
        <GalleryLightbox
          images={images}
          startIdx={lightboxIdx}
          onClose={() => setLightboxIdx(null)}
        />
      )}
    </section>
  );
}
