import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../data/store';
import { useAuth } from '../context/AuthContext';

const steps = ['Personal Info', 'Contact', 'Security'];

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    fullName: '', idNumber: '', dob: '', gender: '',
    email: '', phone: '', address: '',
    password: '', confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handle = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const nextStep = (e) => {
    e.preventDefault();
    setError('');
    if (step === 0) {
      if (!form.fullName || !form.idNumber || !form.dob || !form.gender) { setError('Fill all fields.'); return; }
    }
    if (step === 1) {
      if (!form.email || !form.phone || !form.address) { setError('Fill all fields.'); return; }
    }
    setStep(s => s + 1);
  };

  const submit = (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return; }

    setLoading(true);
    setTimeout(() => {
      const { confirmPassword, ...data } = form;
      const result = registerUser(data);
      if (!result.success) { setError(result.error); setLoading(false); return; }
      login(result.user);
      navigate('/dashboard', { replace: true });
    }, 700);
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div style={{ fontSize: '4rem', marginBottom: '2rem' }}>🌱</div>
        <h2>Join Ujima Sacco</h2>
        <p style={{ marginTop: '0.75rem' }}>Become part of a community that grows together. Access affordable loans and build a better financial future.</p>
        <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {['✅ Free to join', '✅ Loans from KES 5,000', '✅ Fast approval process', '✅ Competitive interest rates'].map(b => (
            <div key={b} style={{ fontSize: '0.875rem', opacity: 0.9 }}>{b}</div>
          ))}
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card fade-in" style={{ maxWidth: 480 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            ← Back to home
          </Link>

          {/* Progress */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.75rem' }}>
            {steps.map((s, i) => (
              <div key={s} style={{ flex: 1 }}>
                <div style={{ height: 4, borderRadius: 2, background: i <= step ? 'var(--primary)' : 'var(--border)', transition: 'background 0.3s' }} />
                <div style={{ fontSize: '0.65rem', marginTop: '0.3rem', color: i <= step ? 'var(--primary)' : 'var(--text-muted)', fontWeight: i === step ? 600 : 400 }}>{s}</div>
              </div>
            ))}
          </div>

          <h2>Create Account</h2>
          <p className="subtitle">Step {step + 1} of {steps.length} — {steps[step]}</p>

          {error && <div className="alert alert-error" style={{ marginBottom: '1rem' }}>{error}</div>}

          {step === 0 && (
            <form onSubmit={nextStep} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" name="fullName" placeholder="John Kamau" value={form.fullName} onChange={handle} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">ID / Passport No.</label>
                  <input className="form-input" name="idNumber" placeholder="12345678" value={form.idNumber} onChange={handle} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Date of Birth</label>
                  <input className="form-input" type="date" name="dob" value={form.dob} onChange={handle} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Gender</label>
                <select className="form-input" name="gender" value={form.gender} onChange={handle} required>
                  <option value="">Select gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Prefer not to say</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary w-full" style={{ marginTop: '0.5rem' }}>Continue →</button>
            </form>
          )}

          {step === 1 && (
            <form onSubmit={nextStep} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input className="form-input" type="email" name="email" placeholder="john@example.com" value={form.email} onChange={handle} required />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input className="form-input" type="tel" name="phone" placeholder="+254712345678" value={form.phone} onChange={handle} required />
              </div>
              <div className="form-group">
                <label className="form-label">Residential Address</label>
                <input className="form-input" name="address" placeholder="Nairobi, Kenya" value={form.address} onChange={handle} required />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setStep(0)}>← Back</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Continue →</button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    className="form-input" type={showPw ? 'text' : 'password'}
                    name="password" placeholder="Min. 6 characters"
                    value={form.password} onChange={handle} required
                    style={{ paddingRight: '3rem', width: '100%' }}
                  />
                  <button type="button" onClick={() => setShowPw(p => !p)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' }}>
                    {showPw ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input className="form-input" type="password" name="confirmPassword" placeholder="Repeat password" value={form.confirmPassword} onChange={handle} required />
              </div>
              <div style={{ background: '#f0fdf4', borderRadius: 8, padding: '0.75rem 1rem', fontSize: '0.8rem', color: '#166534' }}>
                🔒 Your data is encrypted and secure with Ujima Sacco.
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setStep(1)}>← Back</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
                  {loading ? 'Creating...' : '🎉 Create Account'}
                </button>
              </div>
            </form>
          )}

          <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '1.25rem' }}>
            Already a member?{' '}
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
