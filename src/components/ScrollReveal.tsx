'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Global scroll-triggered reveal using GSAP ScrollTrigger.
 * Targets any element with data-reveal, data-reveal-left, data-reveal-right, data-reveal-scale.
 *
 * Re-initialises on every route change so content is never lost after
 * client-side navigation back to this page.
 */
export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let ctx: any = null;

    const init = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      // Kill any stale triggers left over from a previous navigation
      ScrollTrigger.getAll().forEach(t => t.kill());

      const selectors = [
        { attr: '[data-reveal]',       from: { opacity: 0, y: 40 } },
        { attr: '[data-reveal-left]',  from: { opacity: 0, x: -50 } },
        { attr: '[data-reveal-right]', from: { opacity: 0, x: 50 } },
        { attr: '[data-reveal-scale]', from: { opacity: 0, scale: 0.94 } },
      ];

      // Reset every reveal element to its hidden start state so a returning
      // navigation doesn't leave them permanently invisible.
      selectors.forEach(({ attr, from }) => {
        document.querySelectorAll(attr).forEach(el => {
          gsap.set(el, { clearProps: 'all' }); // clear any inline styles first
          gsap.set(el, from);                  // re-apply the hidden start state
        });
      });

      // Use a GSAP context so cleanup is scoped and reliable
      ctx = gsap.context(() => {
        selectors.forEach(({ attr, from }) => {
          document.querySelectorAll(attr).forEach((el) => {
            gsap.fromTo(
              el,
              from,
              {
                opacity: 1,
                x: 0,
                y: 0,
                scale: 1,
                duration: 0.85,
                ease: 'power3.out',
                delay: (el as HTMLElement).dataset.delay
                  ? parseFloat((el as HTMLElement).dataset.delay!)
                  : 0,
                scrollTrigger: {
                  trigger: el,
                  start: 'top 88%',
                  once: true,
                },
              }
            );
          });
        });
      });

      // Recalculate positions after paint (avoids "already passed" issues)
      requestAnimationFrame(() => {
        setTimeout(() => ScrollTrigger.refresh(), 100);
      });
    };

    // Short defer so the DOM is mounted before we query elements
    const timer = setTimeout(() => init(), 50);

    return () => {
      clearTimeout(timer);
      ctx?.revert();
      // Kill triggers on unmount so the next page starts clean
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        ScrollTrigger.getAll().forEach(t => t.kill());
      });
    };
  }, [pathname]); // re-run on every route change

  return null;
}
