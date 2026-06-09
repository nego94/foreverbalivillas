'use client';

import { useEffect } from 'react';
import styles from './CustomCursor.module.css';

export default function CustomCursor() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(pointer: coarse)').matches) return; // skip on touch devices

    document.body.classList.add('has-custom-cursor');

    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    if (!dot || !ring) return;

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    let raf: number;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    };

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      ringX = lerp(ringX, mouseX, 0.12);
      ringY = lerp(ringY, mouseY, 0.12);
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };

    // Event delegation — catches all a/button including ones added dynamically
    const onOver = (e: MouseEvent) => {
      if ((e.target as Element).closest('a, button')) ring.classList.add(styles.expand);
    };
    const onOut = (e: MouseEvent) => {
      if (!(e.relatedTarget as Element | null)?.closest('a, button')) ring.classList.remove(styles.expand);
    };

    window.addEventListener('mousemove', onMove);
    raf = requestAnimationFrame(tick);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      document.body.classList.remove('has-custom-cursor');
    };
  }, []);

  return (
    <>
      <div id="cursor-dot" className={styles.dot} aria-hidden="true" />
      <div id="cursor-ring" className={styles.ring} aria-hidden="true" />
    </>
  );
}
