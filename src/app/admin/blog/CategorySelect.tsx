'use client';

import { useEffect, useRef, useState } from 'react';

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export default function CategorySelect({ value, onChange }: Props) {
  const [categories, setCategories] = useState<string[]>([]);
  const [adding, setAdding]         = useState(false);
  const [newCat, setNewCat]         = useState('');
  const [saving,      setSaving]      = useState(false);
  const [confirming,  setConfirming]  = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = () =>
    fetch('/api/admin/categories').then(r => r.json()).then(setCategories);

  useEffect(() => { load(); }, []);
  useEffect(() => { if (adding) inputRef.current?.focus(); }, [adding]);

  const add = async () => {
    const name = newCat.trim();
    if (!name) return;
    setSaving(true);
    const res  = await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    const updated = await res.json();
    setCategories(updated);
    onChange(name);
    setNewCat('');
    setAdding(false);
    setSaving(false);
  };

  const remove = async (cat: string) => {
    if (!confirming) {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 3000);
      return;
    }
    setConfirming(false);
    const res  = await fetch('/api/admin/categories', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: cat }),
    });
    const data = await res.json();
    setCategories(data.categories ?? categories.filter(c => c !== cat));
    if (value === cat) onChange(categories.find(c => c !== cat) ?? '');
  };

  return (
    <div>
      {adding ? (
        /* ── New category input ── */
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input
            ref={inputRef}
            className="adm-input"
            value={newCat}
            onChange={e => setNewCat(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add(); } if (e.key === 'Escape') setAdding(false); }}
            placeholder="e.g. Honeymoon, Family"
            style={{ flex: 1 }}
          />
          <button className="adm-btn adm-btn-primary adm-btn-sm" onClick={add} disabled={saving || !newCat.trim()}>
            {saving ? '…' : 'Add'}
          </button>
          <button className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => { setAdding(false); setNewCat(''); }}>
            Cancel
          </button>
        </div>
      ) : (
        /* ── Dropdown ── */
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <select
            className="adm-select"
            value={value}
            onChange={e => {
              if (e.target.value === '__new__') { setAdding(true); return; }
              onChange(e.target.value);
            }}
            style={{ flex: 1 }}
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
            <option value="__new__">＋ Add new category…</option>
          </select>
          {value && (
            <button
              className="adm-btn adm-btn-danger adm-btn-sm"
              title={`Remove "${value}" category`}
              onClick={() => remove(value)}
              type="button"
            >
              {confirming ? 'Confirm?' : 'Remove'}
            </button>
          )}
        </div>
      )}

      {/* ── Category pills ── */}
      {categories.length > 0 && !adding && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
          {categories.map(c => (
            <span
              key={c}
              onClick={() => onChange(c)}
              style={{
                padding: '3px 10px',
                borderRadius: '100px',
                fontSize: '0.7rem',
                fontFamily: 'var(--adm-font)',
                cursor: 'pointer',
                background: c === value ? 'var(--adm-accent)' : '#f3f4f6',
                color:      c === value ? '#fff'               : '#374151',
                border:     c === value ? '1px solid var(--adm-accent)' : '1px solid #e5e7eb',
                transition: 'all 0.15s',
              }}
            >
              {c}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
