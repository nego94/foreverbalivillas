'use client';

import { useEffect, useState } from 'react';
import StorageBanner from '@/components/admin/StorageBanner';

interface Settings {
  contact: { email: string; phone: string; whatsapp: string };
  social: { instagram: string; facebook: string; youtube: string };
  booking: { url: string };
  hero: { scrollText: string };
  scripts?: { head?: string; body?: string };
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [storageMode, setStorageMode] = useState<'custom' | 'kv' | 'file' | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetch('/api/admin/settings').then(r => r.json()).then(res => {
      setSettings(res.data ?? res);
      setStorageMode(res.storage ?? 'file');
    });
  }, []);

  if (!settings) return <div style={{ color: 'var(--adm-muted)', padding: '40px' }}>Loading…</div>;

  const setContact = (k: keyof Settings['contact'], v: string) =>
    setSettings(s => s ? { ...s, contact: { ...s.contact, [k]: v } } : s);
  const setSocial = (k: keyof Settings['social'], v: string) =>
    setSettings(s => s ? { ...s, social: { ...s.social, [k]: v } } : s);
  const setBooking = (v: string) =>
    setSettings(s => s ? { ...s, booking: { url: v } } : s);
  const setScript = (field: 'head' | 'body', v: string) =>
    setSettings(s => s ? { ...s, scripts: { ...s.scripts, [field]: v } } : s);

  const save = async () => {
    setError(''); setSuccess('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (!res.ok) { setError('Save failed'); return; }
      setSuccess('Settings saved!');
      setTimeout(() => setSuccess(''), 5000);
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--adm-text)' }}>Site Settings</h1>
        <button className="adm-btn adm-btn-primary" onClick={save} disabled={loading}>
          {loading ? 'Saving…' : 'Save All Changes'}
        </button>
      </div>

      {error && <div className="adm-alert adm-alert-error">{error}</div>}
      {success && <div className="adm-alert adm-alert-ok">{success}</div>}

      <StorageBanner mode={storageMode} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Contact */}
        <div className="adm-card">
          <div className="adm-card-header"><span className="adm-card-title">Contact Information</span></div>
          <div className="adm-card-body">
            <div className="adm-input-row">
              <div className="adm-form-group">
                <label className="adm-label">Email</label>
                <input className="adm-input" type="email" value={settings.contact.email} onChange={e => setContact('email', e.target.value)} />
              </div>
              <div className="adm-form-group">
                <label className="adm-label">Phone (display)</label>
                <input className="adm-input" value={settings.contact.phone} onChange={e => setContact('phone', e.target.value)} />
              </div>
            </div>
            <div className="adm-form-group" style={{ marginBottom: 0 }}>
              <label className="adm-label">WhatsApp Number <span className="adm-label-hint">digits only, e.g. 6281996488881</span></label>
              <input className="adm-input" value={settings.contact.whatsapp} onChange={e => setContact('whatsapp', e.target.value)} />
            </div>
          </div>
        </div>

        {/* Booking */}
        <div className="adm-card">
          <div className="adm-card-header"><span className="adm-card-title">Booking</span></div>
          <div className="adm-card-body">
            <div className="adm-form-group" style={{ marginBottom: 0 }}>
              <label className="adm-label">Booking URL <span className="adm-label-hint">Cloudbeds or other provider link</span></label>
              <input className="adm-input" type="url" value={settings.booking.url} onChange={e => setBooking(e.target.value)} />
            </div>
          </div>
        </div>

        {/* Analytics & Tracking Scripts */}
        <div className="adm-card">
          <div className="adm-card-header">
            <span className="adm-card-title">Analytics &amp; Tracking</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--adm-muted)' }}>Google Analytics, Meta Pixel, Google Ads, etc.</span>
          </div>
          <div className="adm-card-body">
            <div className="adm-form-group">
              <label className="adm-label">
                &lt;head&gt; Scripts
                <span className="adm-label-hint">Google Analytics, Search Console verification, Meta Pixel</span>
              </label>
              <textarea
                className="adm-textarea"
                rows={6}
                value={settings.scripts?.head ?? ''}
                onChange={e => setScript('head', e.target.value)}
                placeholder={`<!-- Example: Google Analytics -->\n<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>\n<script>\n  window.dataLayer = window.dataLayer || [];\n  function gtag(){dataLayer.push(arguments);}\n  gtag('js', new Date());\n  gtag('config', 'G-XXXXXXXXXX');\n</script>`}
                style={{ fontFamily: 'monospace', fontSize: '0.78rem' }}
              />
            </div>
            <div className="adm-form-group" style={{ marginBottom: 0 }}>
              <label className="adm-label">
                &lt;body&gt; Scripts
                <span className="adm-label-hint">Chat widgets, additional tracking that must load after page body</span>
              </label>
              <textarea
                className="adm-textarea"
                rows={4}
                value={settings.scripts?.body ?? ''}
                onChange={e => setScript('body', e.target.value)}
                placeholder="<!-- Paste scripts here that should load after the page body -->"
                style={{ fontFamily: 'monospace', fontSize: '0.78rem' }}
              />
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--adm-muted)', marginTop: '8px', lineHeight: 1.6 }}>
              Paste the full <code>&lt;script&gt;</code> tags exactly as given by Google/Meta/etc.
              Head scripts load before the page renders. Body scripts load after.
              Changes take effect on the live site within ~60 seconds.
            </p>
          </div>
        </div>

        {/* Social */}
        <div className="adm-card">
          <div className="adm-card-header"><span className="adm-card-title">Social Media Links</span></div>
          <div className="adm-card-body">
            {(['instagram', 'facebook', 'youtube'] as const).map(k => (
              <div className="adm-form-group" key={k} style={{ marginBottom: k === 'youtube' ? 0 : undefined }}>
                <label className="adm-label" style={{ textTransform: 'capitalize' }}>{k}</label>
                <input className="adm-input" type="url" value={settings.social[k]} onChange={e => setSocial(k, e.target.value)} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
