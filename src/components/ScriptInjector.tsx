'use client';

import { useEffect, useRef } from 'react';

interface Props {
  headHtml?: string;
  bodyHtml?: string;
}

function inject(html: string, target: HTMLElement) {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  Array.from(tmp.children).forEach(el => {
    if (el.tagName === 'SCRIPT') {
      const s = document.createElement('script');
      Array.from(el.attributes).forEach(a => s.setAttribute(a.name, a.value));
      s.textContent = el.textContent;
      target.appendChild(s);
    } else {
      target.appendChild(el.cloneNode(true));
    }
  });
}

export default function ScriptInjector({ headHtml, bodyHtml }: Props) {
  const injected = useRef(false);

  useEffect(() => {
    if (injected.current) return;
    injected.current = true;

    if (headHtml?.trim()) inject(headHtml, document.head);
    if (bodyHtml?.trim()) inject(bodyHtml, document.body);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
