'use client';

import { useEffect, useState } from 'react';

type State = 'connecting' | 'connected' | 'offline';

export default function DatabaseStatus() {
  const [state, setState] = useState<State>('connecting');

  useEffect(() => {
    // Check all three endpoints in parallel
    Promise.all([
      fetch('/api/admin/content').then(r => r.json()),
      fetch('/api/admin/blog').then(r => r.json()),
      fetch('/api/admin/settings').then(r => r.json()),
    ])
      .then(([content, , settings]) => {
        const mode = content.storage ?? settings.storage ?? 'file';
        setState(mode === 'custom' || mode === 'kv' ? 'connected' : 'offline');
      })
      .catch(() => setState('offline'));
  }, []);

  if (state === 'connecting') {
    return (
      <div style={bannerBase('#e8f0fe', '#1a56db')}>
        <Spinner color="#1a56db" />
        <span>
          <strong>Connecting to database</strong> — please wait until connected before making changes…
        </span>
      </div>
    );
  }

  if (state === 'connected') {
    return (
      <div style={bannerBase('#f0fdf4', '#15803d')}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <span>
          <strong>All systems connected</strong> — you're good to edit. Changes go live within a few minutes.
        </span>
      </div>
    );
  }

  return (
    <div style={bannerBase('#fefce8', '#a16207')}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a16207" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
      <span>
        <strong>Database not connected</strong> — changes won&apos;t persist. Add <code>CUSTOM_STORAGE_URL</code> to your Vercel environment variables.
      </span>
    </div>
  );
}

function bannerBase(bg: string, color: string): React.CSSProperties {
  return {
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '14px 18px', borderRadius: '10px', marginBottom: '24px',
    background: bg, color, fontSize: '0.84rem', lineHeight: 1.5,
    border: `1px solid ${color}22`,
  };
}

function Spinner({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"
      style={{ animation: 'spin 1s linear infinite', flexShrink: 0 }}>
      <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/>
      <path d="M12 2a10 10 0 0 1 10 10"/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </svg>
  );
}
