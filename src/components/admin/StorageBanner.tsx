'use client';

type Mode = 'custom' | 'kv' | 'file' | null;

export default function StorageBanner({ mode }: { mode: Mode }) {
  if (mode === null) {
    return (
      <div className="adm-alert adm-alert-info" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Spinner />
        <span>Connecting to database — please wait before editing…</span>
      </div>
    );
  }

  if (mode === 'custom' || mode === 'kv') {
    return (
      <div className="adm-alert adm-alert-ok" style={{ marginBottom: '20px' }}>
        ✓ <strong>Database connected</strong> — changes save to your hosting server and go live within a few minutes.
      </div>
    );
  }

  // file mode — not connected to external storage
  return (
    <div className="adm-alert adm-alert-warn" style={{ marginBottom: '20px' }}>
      <strong>⚠ Database not connected</strong> — changes save locally and will be lost on next deployment.
      Set <code>CUSTOM_STORAGE_URL</code> in your Vercel environment variables to connect your hosting.
    </div>
  );
}

function Spinner() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      style={{ animation: 'spin 1s linear infinite', flexShrink: 0 }}>
      <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/>
      <path d="M12 2a10 10 0 0 1 10 10"/>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </svg>
  );
}
