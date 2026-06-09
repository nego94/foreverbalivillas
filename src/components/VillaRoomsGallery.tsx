'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import styles from './VillaRoomsGallery.module.css';
import type { RoomTab } from './VillaPage';

export default function VillaRoomsGallery({ rooms }: { rooms: RoomTab[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null!);
  const cursorRef = useRef<HTMLDivElement>(null);

  const [activeRoomIdx, setActiveRoomIdx] = useState(0);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [cursorVisible, setCursorVisible] = useState(false);
  const [cursorPressed, setCursorPressed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);

  useEffect(() => { setMounted(true); }, []);

  // Drag state
  const dragging = useRef(false);
  const startX = useRef(0);
  const startScroll = useRef(0);
  const prevX = useRef(0);
  const vel = useRef(0);
  const animRaf = useRef(0);
  const dragDist = useRef(0);

  // Lightbox swipe state
  const lbTouchStartX = useRef(0);

  const currentRoom = rooms[activeRoomIdx];
  const images = currentRoom?.images || [];

  const slideW = () => wrapRef.current?.clientWidth ?? window.innerWidth;

  const clampAndSetIdx = useCallback(() => {
    const t = trackRef.current;
    if (!t) return;
    const sw = slideW();
    const cur = Math.round(t.scrollLeft / sw);
    const safeCur = Math.max(0, Math.min(cur, images.length - 1));
    setActiveImageIdx(safeCur);
  }, [images.length]);

  const snap = useCallback((velocityPx: number) => {
    const t = trackRef.current;
    if (!t) return;
    const sw = slideW();
    let targetIdx = Math.round((t.scrollLeft + velocityPx * 50) / sw);
    targetIdx = Math.max(0, Math.min(targetIdx, images.length - 1));
    const target = targetIdx * sw;

    cancelAnimationFrame(animRaf.current);
    const from = t.scrollLeft;
    const dist = target - from;
    const dur = Math.min(Math.abs(dist) * 0.6, 500);
    const start = performance.now();

    if (dist === 0) { clampAndSetIdx(); return; }

    const animate = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      t.scrollLeft = from + dist * ease;
      if (p < 1) {
        animRaf.current = requestAnimationFrame(animate);
      } else {
        t.scrollLeft = target;
        clampAndSetIdx();
      }
    };
    animRaf.current = requestAnimationFrame(animate);
  }, [clampAndSetIdx, images.length]);

  const goToImage = useCallback((idx: number) => {
    const safeIdx = Math.max(0, Math.min(idx, images.length - 1));
    const t = trackRef.current;
    if (!t) return;
    const sw = slideW();
    const target = safeIdx * sw;
    cancelAnimationFrame(animRaf.current);
    const from = t.scrollLeft;
    const dist = target - from;
    const dur = Math.min(Math.abs(dist) * 0.5, 600) + 100;
    const start = performance.now();
    if (dist === 0) { setActiveImageIdx(safeIdx); return; }
    const go = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      t.scrollLeft = from + dist * ease;
      if (p < 1) animRaf.current = requestAnimationFrame(go);
      else { t.scrollLeft = target; setActiveImageIdx(safeIdx); }
    };
    animRaf.current = requestAnimationFrame(go);
    setActiveImageIdx(safeIdx);
  }, [images.length]);

  const handleRoomChange = (idx: number) => {
    setActiveRoomIdx(idx);
    setActiveImageIdx(0);
    setLightboxOpen(false);
    if (trackRef.current) {
      cancelAnimationFrame(animRaf.current);
      trackRef.current.scrollLeft = 0;
    }
  };

  // Resize: re-align scroll position
  useEffect(() => {
    const handleResize = () => {
      if (trackRef.current) {
        trackRef.current.scrollLeft = activeImageIdx * slideW();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeImageIdx]);

  // Touch: prevent vertical scroll during horizontal swipe
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onTouchMove = (e: TouchEvent) => {
      if (dragging.current) e.preventDefault();
    };
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    return () => el.removeEventListener('touchmove', onTouchMove);
  }, []);

  // Pointer events for gallery drag
  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const t = trackRef.current;
    if (!t) return;
    cancelAnimationFrame(animRaf.current);
    dragging.current = true;
    startX.current = e.clientX;
    startScroll.current = t.scrollLeft;
    prevX.current = e.clientX;
    vel.current = 0;
    dragDist.current = 0;
    e.currentTarget.setPointerCapture(e.pointerId);
    setCursorPressed(true);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (cursorRef.current) {
      cursorRef.current.style.transform = `translate(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%))`;
    }
    if (!dragging.current || !trackRef.current) return;
    const dx = e.clientX - startX.current;
    trackRef.current.scrollLeft = startScroll.current - dx;
    vel.current = prevX.current - e.clientX;
    dragDist.current = Math.abs(dx);
    prevX.current = e.clientX;
  }, []);

  const onPointerUp = useCallback(() => {
    if (!dragging.current) return;
    dragging.current = false;
    setCursorPressed(false);
    snap(vel.current);
  }, [snap]);

  // onClick fires reliably on both desktop (mouse) and mobile (tap).
  // dragDist is reset on every pointerdown, so < 8 means it was a tap not a drag.
  const handleGalleryClick = useCallback(() => {
    if (dragDist.current < 8) {
      setLightboxIdx(activeImageIdx);
      setLightboxOpen(true);
    }
  }, [activeImageIdx]);

  // Lightbox keyboard navigation
  useEffect(() => {
    if (!lightboxOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowLeft') setLightboxIdx(i => Math.max(0, i - 1));
      if (e.key === 'ArrowRight') setLightboxIdx(i => Math.min(images.length - 1, i + 1));
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightboxOpen, images.length]);

  // Lock body scroll + suppress custom cursor when lightbox open
  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('cursor-suppressed');
    } else {
      document.body.style.overflow = '';
      document.body.classList.remove('cursor-suppressed');
    }
    return () => {
      document.body.style.overflow = '';
      document.body.classList.remove('cursor-suppressed');
    };
  }, [lightboxOpen]);

  if (!rooms || rooms.length === 0 || images.length === 0) return null;

  return (
    <section className={styles.section} aria-label="The Rooms">
      <div className={styles.header} data-reveal>
        <h2 className={styles.title}>The Rooms</h2>
        <div className={styles.tabs} role="tablist">
          {rooms.map((room, idx) => (
            <button
              key={room.id}
              role="tab"
              aria-selected={activeRoomIdx === idx}
              className={`${styles.tab} ${activeRoomIdx === idx ? styles.tabActive : ''}`}
              onClick={() => handleRoomChange(idx)}
            >
              {room.label}
            </button>
          ))}
        </div>
        <div className={styles.swipeHint} aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.4">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span className={styles.swipeLine} />
          <span className={styles.swipeLetter}>Swipe</span>
          <span className={styles.swipeLine} />
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.4">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
      </div>

      <div
        ref={wrapRef}
        className={styles.galleryWrap}
        data-reveal
        onMouseEnter={() => setCursorVisible(true)}
        onMouseLeave={() => {
          setCursorVisible(false);
          if (dragging.current) { dragging.current = false; setCursorPressed(false); snap(vel.current); }
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClick={handleGalleryClick}
      >
        <div ref={trackRef} className={styles.track}>
          {images.map((src, idx) => (
            <div key={`${currentRoom.id}-${idx}`} className={styles.slide}>
              <Image
                src={src}
                alt={`${currentRoom.label} - Image ${idx + 1}`}
                fill
                sizes="100vw"
                priority={idx === 0}
                className={styles.slideImg}
                draggable={false}
              />
              <div className={styles.slideContent}>
                <p className={styles.slideDesc}>{currentRoom.description}</p>
                {images.length > 1 && (
                  <div className={styles.counter} aria-hidden="true">
                    <span className={styles.counterCurrent}>
                      {String(activeImageIdx + 1).padStart(2, '0')}
                    </span>
                    <div className={styles.counterTrack}>
                      <div
                        className={styles.counterFill}
                        style={{ width: `${((activeImageIdx + 1) / images.length) * 100}%` }}
                      />
                    </div>
                    <span className={styles.counterTotal}>
                      {String(images.length).padStart(2, '0')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {activeImageIdx > 0 && images.length > 1 && (
          <button
            className={`${styles.arrow} ${styles.arrowLeft}`}
            onClick={e => { e.stopPropagation(); goToImage(activeImageIdx - 1); }}
            onPointerDown={e => e.stopPropagation()}
            aria-label="Previous"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}

        {activeImageIdx < images.length - 1 && images.length > 1 && (
          <button
            className={`${styles.arrow} ${styles.arrowRight}`}
            onClick={e => { e.stopPropagation(); goToImage(activeImageIdx + 1); }}
            onPointerDown={e => e.stopPropagation()}
            aria-label="Next"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        )}
      </div>

      {/* Drag cursor portal */}
      {mounted && createPortal(
        <div
          ref={cursorRef}
          className={`${styles.dragCursor} ${cursorVisible && !lightboxOpen ? styles.cursorVisible : ''} ${cursorPressed ? styles.cursorPress : ''}`}
          aria-hidden="true"
        >
          <span>DRAG</span>
        </div>,
        document.body
      )}

      {/* Lightbox portal */}
      {mounted && lightboxOpen && createPortal(
        <div
          className={styles.lightbox}
          onClick={() => setLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Image enlarged view"
        >
          {/* Close */}
          <button
            className={styles.lightboxClose}
            onClick={() => setLightboxOpen(false)}
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Image — stop click propagation so clicking image doesn't close */}
          <img
            key={lightboxIdx}
            src={images[lightboxIdx]}
            alt={`${currentRoom.label} - Image ${lightboxIdx + 1}`}
            className={styles.lightboxImg}
            draggable={false}
            onClick={e => e.stopPropagation()}
            onTouchStart={e => { lbTouchStartX.current = e.touches[0].clientX; }}
            onTouchEnd={e => {
              const dx = e.changedTouches[0].clientX - lbTouchStartX.current;
              if (Math.abs(dx) > 50) {
                if (dx > 0) setLightboxIdx(i => Math.max(0, i - 1));
                else setLightboxIdx(i => Math.min(images.length - 1, i + 1));
              }
            }}
          />

          {/* Prev arrow */}
          {lightboxIdx > 0 && (
            <button
              className={`${styles.lightboxArrow} ${styles.lightboxPrev}`}
              onClick={e => { e.stopPropagation(); setLightboxIdx(i => i - 1); }}
              aria-label="Previous image"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
          )}

          {/* Next arrow */}
          {lightboxIdx < images.length - 1 && (
            <button
              className={`${styles.lightboxArrow} ${styles.lightboxNext}`}
              onClick={e => { e.stopPropagation(); setLightboxIdx(i => i + 1); }}
              aria-label="Next image"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          )}

          {/* Counter */}
          {images.length > 1 && (
            <div className={styles.lightboxCounter} onClick={e => e.stopPropagation()}>
              {lightboxIdx + 1} / {images.length}
            </div>
          )}
        </div>,
        document.body
      )}
    </section>
  );
}
