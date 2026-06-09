'use client';

import { useState } from 'react';

export default function NewsletterStrip() {
  const [email,   setEmail]   = useState('');
  const [status,  setStatus]  = useState<'idle' | 'success' | 'error'>('idle');
  const [errMsg,  setErrMsg]  = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setErrMsg('Please enter a valid email address.');
      setStatus('error');
      return;
    }
    setStatus('idle'); setErrMsg('');
    try {
      const res  = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('success'); setEmail('');
      } else {
        setErrMsg(data.error || 'Something went wrong. Please try again.');
        setStatus('error');
      }
    } catch {
      setErrMsg('Connection error. Please try again.');
      setStatus('error');
    }
  };

  return (
    <section className="newsletter-strip">
      <div className="container">
        <div className="newsletter-inner">
          <div className="newsletter-text" data-reveal>
            <p className="t-label" style={{ color: 'var(--forest)', marginBottom: '6px' }}>
              Stay Connected
            </p>
            <h3 className="t-h2">Stories Delivered to You</h3>
            <p style={{ marginTop: '10px', color: 'var(--gray)', fontSize: '0.88rem' }}>
              Subscribe to The Journal and receive our latest stories, travel guides and exclusive villa news directly to your inbox.
            </p>
          </div>

          <form className="newsletter-form" onSubmit={handleSubmit} data-reveal>
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); if (status === 'error') { setStatus('idle'); setErrMsg(''); } }}
              placeholder={status === 'success' ? '✓ You\'re subscribed!' : 'Your email address'}
              aria-label="Your email address"
              required
              disabled={status === 'success'}
              style={status === 'error' ? { borderColor: '#e53e3e' } : undefined}
            />
            <button type="submit" disabled={status === 'success'}>
              {status === 'success' ? 'Subscribed ✓' : 'Subscribe'}
            </button>
            {status === 'error' && errMsg && (
              <p style={{ color: '#e53e3e', fontSize: '0.75rem', marginTop: '6px', width: '100%' }}>
                {errMsg}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
