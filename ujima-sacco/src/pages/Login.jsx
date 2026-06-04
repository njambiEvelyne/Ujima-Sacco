import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../data/store';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handle = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const result = loginUser(form.email, form.password);
      if (!result.success) { setError(result.error); setLoading(false); return; }
      login(result.user);
      navigate(result.user.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
    }, 600);
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div style={{ marginBottom: '2rem', fontSize: '4rem' }}>🏦</div>
        <h2>Welcome Back</h2>
        <p style={{ marginTop: '0.75rem' }}>Sign in to manage your loans, track repayments, and stay on top of your finances.</p>
        <div style={{ marginTop: '2.5rem', background: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: '1.25rem 1.5rem', maxWidth: 300 }}>
          <div style={{ fontSize: '0.75rem', opacity: 0.7, marginBottom: '0.5rem' }}>Demo Admin Account</div>
          <div style={{ fontSize: '0.875rem' }}>📧 admin@ujima.co.ke</div>
          <div style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>🔑 Admin@1234</div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card fade-in">
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            ← Back to home
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.3rem' }}>
            <div style={{ width: 36, height: 36, background: 'var(--primary)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700 }}>U</div>
            <span style={{ fontWeight: 700, color: 'var(--primary)' }}>Ujima Sacco</span>
          </div>
          <h2>Sign In</h2>
          <p className="subtitle">Enter your credentials to access your account</p>

          {error && <div className="alert alert-error" style={{ marginBottom: '1rem' }}>{error}</div>}

          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                className="form-input"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handle}
                required
                autoComplete="email"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  className="form-input"
                  type={showPw ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handle}
                  required
                  autoComplete="current-password"
                  style={{ paddingRight: '3rem', width: '100%' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(p => !p)}
                  style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', color: 'var(--text-muted)' }}
                >
                  {showPw ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-full" disabled={loading} style={{ marginTop: '0.5rem' }}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          <div className="divider-text" style={{ margin: '1.5rem 0' }}>or</div>

          <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
