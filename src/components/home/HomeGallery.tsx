'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import styles from './HomeGallery.module.css';

const DEFAULT_BASE = [
  { src: '/images/home/gallery/gallery-01.webp', alt: 'Forever Bali Villas — 1' },
  { src: '/images/home/gallery/gallery-02.webp', alt: 'Forever Bali Villas — 2' },
  { src: '/images/home/gallery/gallery-03.webp', alt: 'Forever Bali Villas — 3' },
  { src: '/images/home/gallery/gallery-04.webp', alt: 'Forever Bali Villas — 4' },
  { src: '/images/home/gallery/gallery-05.webp', alt: 'Forever Bali Villas — 5' },
  { src: '/images/home/gallery/gallery-06.webp', alt: 'Forever Bali Villas — 6' },
  { src: '/images/home/gallery/gallery-07.webp', alt: 'Forever Bali Villas — 7' },
  { src: '/images/home/gallery/gallery-08.webp', alt: 'Forever Bali Villas — 8' },
];

export default function HomeGallery({ galleryImages }: { galleryImages?: string[] }) {
  const BASE = (galleryImages && galleryImages.length > 0)
    ? galleryImages.map((src, i) => ({ src, alt: `Forever Bali Villas — ${i + 1}` }))
    : DEFAULT_BASE;
  const N = BASE.length;
  const SLIDES = [...BASE, ...BASE, ...BASE];
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  const [activeIdx, setActiveIdx] = useState(0);
  const [cursorVisible, setCursorVisible] = useState(false);
  const [cursorPressed, setCursorPressed] = useState(false);

  // All drag state in refs — zero re-renders during drag
  const dragging = useRef(false);
  const startX = useRef(0);
  const startScroll = useRef(0);
  const prevX = useRef(0);
  const vel = useRef(0);
  const animRaf = useRef(0);
  const jumping = useRef(false); // guard against recursive scroll corrections

  // ── Helpers ──────────────────────────────────────────────────
  const slideW = () => wrapRef.current?.clientWidth ?? window.innerWidth;

  /** Clamp scrollLeft to the middle clone set to keep infinite illusion */
  const clamp = useCallback(() => {
    const t = trackRef.current;
    if (!t || jumping.current) return;
    const sw = slideW();
    // Middle set starts at N*sw, ends at 2N*sw
    if (t.scrollLeft < sw * 0.5) {
      jumping.current = true;
      t.scrollLeft += N * sw;
      jumping.current = false;
    } else if (t.scrollLeft >= sw * (N * 2 + 0.5)) {
      jumping.current = true;
      t.scrollLeft -= N * sw;
      jumping.current = false;
    }
    setActiveIdx(Math.round(t.scrollLeft / sw) % N);
  }, []);

  /** Snap to nearest whole slide with smooth scroll */
  const snap = useCallback((velocityPx: number) => {
    const t = trackRef.current;
    if (!t) return;
    const sw = slideW();
    const projected = t.scrollLeft + velocityPx * 55;
    const target = Math.round(projected / sw) * sw;
    // Smooth scroll via requestAnimationFrame lerp
    cancelAnimationFrame(animRaf.current);
    const from = t.scrollLeft;
    const dist = target - from;
    const dur = Math.min(Math.abs(dist) * 0.6, 500); // ms, proportional
    const start = performance.now();
    const animate = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3); // cubic ease-out
      t.scrollLeft = from + dist * ease;
      if (p < 1) {
        animRaf.current = requestAnimationFrame(animate);
      } else {
        t.scrollLeft = target;
        clamp();
      }
    };
    animRaf.current = requestAnimationFrame(animate);
  }, [clamp]);

  // ── Initialise scroll to middle set on mount & resize ────────
  const init = useCallback(() => {
    const t = trackRef.current;
    if (!t) return;
    const sw = slideW();
    t.scrollLeft = N * sw; // start of middle clone
    setActiveIdx(0);
  }, []);

  useEffect(() => {
    requestAnimationFrame(init);
    window.addEventListener('resize', init);
    return () => {
      window.removeEventListener('resize', init);
      cancelAnimationFrame(animRaf.current);
    };
  }, [init]);

  // ── Non-passive touchmove (needed to preventDefault) ─────────
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onTouchMove = (e: TouchEvent) => {
      if (!dragging.current) return;
      e.preventDefault();
      const t = trackRef.current;
      if (!t) return;
      const dx = e.touches[0].clientX - startX.current;
      t.scrollLeft = startScroll.current - dx;
      vel.current = prevX.current - e.touches[0].clientX;
      prevX.current = e.touches[0].clientX;
      clamp();
    };
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    return () => el.removeEventListener('touchmove', onTouchMove);
  }, [clamp]);

  // ── Pointer events (mouse) ────────────────────────────────────
  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const t = trackRef.current;
    if (!t) return;
    cancelAnimationFrame(animRaf.current);
    dragging.current = true;
    startX.current = e.clientX;
    startScroll.current = t.scrollLeft;
    prevX.current = e.clientX;
    vel.current = 0;
    e.currentTarget.setPointerCapture(e.pointerId);
    setCursorPressed(true);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (cursorRef.current) {
      cursorRef.current.style.transform =
        `translate(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%))`;
    }
    if (!dragging.current || !trackRef.current) return;
    const dx = e.clientX - startX.current;
    trackRef.current.scrollLeft = startScroll.current - dx;
    vel.current = prevX.current - e.clientX;
    prevX.current = e.clientX;
    clamp();
  }, [clamp]);

  const onPointerUp = useCallback(() => {
    if (!dragging.current) return;
    dragging.current = false;
    setCursorPressed(false);
    snap(vel.current);
  }, [snap]);

  // ── Touch start/end (move handled via non-passive listener) ──
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const t = trackRef.current;
    if (!t) return;
    cancelAnimationFrame(animRaf.current);
    dragging.current = true;
    startX.current = e.touches[0].clientX;
    startScroll.current = t.scrollLeft;
    prevX.current = e.touches[0].clientX;
    vel.current = 0;
  }, []);

  const onTouchEnd = useCallback(() => {
    dragging.current = false;
    snap(vel.current);
  }, [snap]);

  // ── Arrow / dot navigation ────────────────────────────────────
  const goTo = useCallback((dir: -1 | 1) => {
    const t = trackRef.current;
    if (!t) return;
    const sw = slideW();
    const cur = Math.round(t.scrollLeft / sw);
    snap(0);
    cancelAnimationFrame(animRaf.current);
    const target = (cur + dir) * sw;
    const from = t.scrollLeft;
    const dist = target - from;
    const dur = 450;
    const start = performance.now();
    const go = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      t.scrollLeft = from + dist * ease;
      if (p < 1) animRaf.current = requestAnimationFrame(go);
      else { t.scrollLeft = target; clamp(); }
    };
    animRaf.current = requestAnimationFrame(go);
    setActiveIdx(((cur + dir) % N + N) % N);
  }, [clamp, snap]);

  const goToDot = useCallback((idx: number) => {
    const t = trackRef.current;
    if (!t) return;
    const sw = slideW();
    const cur = Math.round(t.scrollLeft / sw);
    const curSet = Math.floor(cur / N);
    const target = (curSet * N + idx) * sw;
    const from = t.scrollLeft;
    const dist = target - from;
    const dur = Math.min(Math.abs(dist) * 0.5, 600);
    const start = performance.now();
    cancelAnimationFrame(animRaf.current);
    const go = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      t.scrollLeft = from + dist * ease;
      if (p < 1) animRaf.current = requestAnimationFrame(go);
      else { t.scrollLeft = target; clamp(); }
    };
    animRaf.current = requestAnimationFrame(go);
    setActiveIdx(idx);
  }, [clamp]);

  return (
    <section className={styles.section} aria-label="Photo gallery">

      {/* Custom DRAG cursor — fixed, JS-positioned via transform */}
      <div
        ref={cursorRef}
        className={`${styles.dragCursor} ${cursorVisible ? styles.cursorVisible : ''} ${cursorPressed ? styles.cursorPress : ''}`}
        aria-hidden="true"
      >
        <span>DRAG</span>
      </div>

      {/* Outer wrapper — pointer events live here */}
      <div
        ref={wrapRef}
        className={styles.wrap}
        onMouseEnter={() => setCursorVisible(true)}
        onMouseLeave={() => { setCursorVisible(false); if (dragging.current) { dragging.current = false; setCursorPressed(false); snap(vel.current); } }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Track — overflow hidden, we control scrollLeft directly */}
        <div ref={trackRef} className={styles.track}>
          {SLIDES.map((slide, i) => (
            <div key={i} className={styles.slide}>
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                sizes="100vw"
                priority={i >= N && i < N * 2}
                className={styles.img}
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Left arrow */}
      <button className={`${styles.arrow} ${styles.arrowLeft}`} onClick={() => goTo(-1)} aria-label="Previous">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {/* Right arrow */}
      <button className={`${styles.arrow} ${styles.arrowRight}`} onClick={() => goTo(1)} aria-label="Next">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* Slide counter — e.g. 01 ——— 08 */}
      <div className={styles.counter} aria-hidden="true">
        <span className={styles.counterCurrent}>
          {String(activeIdx + 1).padStart(2, '0')}
        </span>
        <div className={styles.counterTrack}>
          <div
            className={styles.counterFill}
            style={{ width: `${((activeIdx + 1) / BASE.length) * 100}%` }}
          />
        </div>
        <span className={styles.counterTotal}>
          {String(BASE.length).padStart(2, '0')}
        </span>
      </div>
    </section>
  );
}
