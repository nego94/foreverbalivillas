'use client';

import { useEffect, useState } from 'react';

interface User { id: string; username: string; name: string; role: 'admin' | 'editor'; createdAt: string }

export default function UsersPage() {
  const [users,        setUsers]        = useState<User[]>([]);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [form, setForm] = useState({ username: '', name: '', password: '', role: 'editor' as 'admin' | 'editor' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    try {
      const res  = await fetch('/api/admin/users');
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setUsers(data);
      } else {
        setError(data.error || `Failed to load users (${res.status})`);
      }
    } catch {
      setError('Network error — could not reach the server');
    }
  };
  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const addUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed'); return; }
      setSuccess(`User "${form.username}" created.`);
      setForm({ username: '', name: '', password: '', role: 'editor' });
      setShowForm(false);
      await load();
      setTimeout(() => setSuccess(''), 4000);
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: string) => {
    if (confirmingId !== id) {
      setConfirmingId(id);
      setTimeout(() => setConfirmingId(null), 3000);
      return;
    }
    setConfirmingId(null);
    await fetch('/api/admin/users', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    load();
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--adm-text)' }}>Users</h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--adm-muted)', marginTop: '2px' }}>Manage who can access the admin panel</p>
        </div>
        <button className="adm-btn adm-btn-primary" onClick={() => setShowForm(s => !s)}>
          {showForm ? 'Cancel' : '+ Add User'}
        </button>
      </div>

      {error && <div className="adm-alert adm-alert-error">{error}</div>}
      {success && <div className="adm-alert adm-alert-ok">{success}</div>}

      {showForm && (
        <div className="adm-card" style={{ marginBottom: '20px' }}>
          <div className="adm-card-header"><span className="adm-card-title">Add New User</span></div>
          <form className="adm-card-body" onSubmit={addUser}>
            <div className="adm-input-row">
              <div className="adm-form-group">
                <label className="adm-label">Full Name</label>
                <input className="adm-input" value={form.name} onChange={e => set('name', e.target.value)} required />
              </div>
              <div className="adm-form-group">
                <label className="adm-label">Username</label>
                <input className="adm-input" value={form.username} onChange={e => set('username', e.target.value)} autoComplete="off" required />
              </div>
            </div>
            <div className="adm-input-row">
              <div className="adm-form-group">
                <label className="adm-label">Password</label>
                <input className="adm-input" type="password" value={form.password} onChange={e => set('password', e.target.value)} autoComplete="new-password" required />
              </div>
              <div className="adm-form-group">
                <label className="adm-label">Role</label>
                <select className="adm-select" value={form.role} onChange={e => set('role', e.target.value)}>
                  <option value="editor">Editor — can edit content</option>
                  <option value="admin">Admin — full access + user management</option>
                </select>
              </div>
            </div>
            <button className="adm-btn adm-btn-primary" type="submit" disabled={loading}>{loading ? 'Creating…' : 'Create User'}</button>
          </form>
        </div>
      )}

      <div className="adm-card">
        <div className="adm-card-header">
          <span className="adm-card-title">Active Users</span>
        </div>
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr><th>Name</th><th>Username</th><th>Role</th><th>Created</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {/* Env admin always shown */}
              <tr>
                <td style={{ fontWeight: 500 }}>Administrator</td>
                <td style={{ fontFamily: 'monospace', fontSize: '0.78rem' }}>{process.env.NEXT_PUBLIC_ADMIN_USERNAME || 'admin'}</td>
                <td><span className="adm-badge adm-badge-green">admin</span></td>
                <td style={{ color: '#9ca3af' }}>env variable</td>
                <td><span style={{ fontSize: '0.72rem', color: '#9ca3af' }}>Set in .env</span></td>
              </tr>
              {users.map(u => (
                <tr key={u.id}>
                  <td style={{ fontWeight: 500 }}>{u.name}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.78rem' }}>{u.username}</td>
                  <td><span className={`adm-badge ${u.role === 'admin' ? 'adm-badge-green' : 'adm-badge-blue'}`}>{u.role}</span></td>
                  <td style={{ color: '#9ca3af' }}>{u.createdAt?.slice(0, 10)}</td>
                  <td>
                    <button className="adm-btn adm-btn-danger adm-btn-sm" onClick={() => deleteUser(u.id)}>
                      {confirmingId === u.id ? 'Confirm?' : 'Remove'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
