import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { applyLoan, formatKES, getUserLoans } from '../data/store';

const purposes = [
  'Business Expansion', 'Education', 'Medical', 'Housing / Construction',
  'Agricultural', 'Personal / Emergency', 'Asset Purchase', 'School Fees', 'Other',
];

export default function ApplyLoan() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ amount: '', duration: '12', purpose: '', description: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const amount = Number(form.amount) || 0;
  const duration = Number(form.duration) || 12;
  const rate = 12 / 100 / 12;
  const monthly = amount > 0
    ? Math.round((amount * rate * Math.pow(1 + rate, duration)) / (Math.pow(1 + rate, duration) - 1))
    : 0;
  const totalRepay = monthly * duration;
  const totalInterest = totalRepay - amount;

  const existingLoans = getUserLoans(user?.id);
  const hasActiveLoan = existingLoans.some(l => l.status === 'pending' || l.status === 'approved');

  const submit = (e) => {
    e.preventDefault();
    setError('');
    if (amount < 5000) { setError('Minimum loan amount is KES 5,000.'); return; }
    if (amount > 2000000) { setError('Maximum loan amount is KES 2,000,000.'); return; }

    setLoading(true);
    setTimeout(() => {
      const result = applyLoan(user.id, form);
      if (!result.success) { setError(result.error); setLoading(false); return; }
      setSuccess(true);
      setTimeout(() => navigate('/dashboard/loans'), 2200);
    }, 800);
  };

  if (hasActiveLoan) {
    return (
      <div className="card" style={{ maxWidth: 580, margin: '0 auto', textAlign: 'center', padding: '3rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
        <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Active Loan Exists</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>You already have a pending or approved loan. Please settle or wait for a decision before applying again.</p>
        <button className="btn btn-primary" onClick={() => navigate('/dashboard/loans')}>View My Loans</button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="card fade-in" style={{ maxWidth: 500, margin: '0 auto', textAlign: 'center', padding: '3rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
        <h3 style={{ fontWeight: 700, fontSize: '1.3rem', marginBottom: '0.5rem' }}>Application Submitted!</h3>
        <p style={{ color: 'var(--text-muted)' }}>Your loan application of <strong>{formatKES(amount)}</strong> has been received. We'll review it within 24 hours.</p>
        <div style={{ marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>Redirecting to loans page...</div>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '2rem', alignItems: 'start' }}>
      <div className="card">
        <h3 style={{ fontWeight: 700, marginBottom: '0.3rem' }}>Loan Application</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.75rem' }}>Fill in the details below. Decisions are made within 24 hours.</p>

        {error && <div className="alert alert-error" style={{ marginBottom: '1rem' }}>{error}</div>}

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label">Loan Amount (KES)</label>
            <input className="form-input" type="number" name="amount" min="5000" max="2000000" step="1000" placeholder="e.g. 50,000" value={form.amount} onChange={handle} required />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Min: KES 5,000 · Max: KES 2,000,000</span>
          </div>

          <div className="form-group">
            <label className="form-label">Repayment Period</label>
            <select className="form-input" name="duration" value={form.duration} onChange={handle} required>
              {[3, 6, 12, 18, 24, 36, 48, 60].map(m => (
                <option key={m} value={m}>{m} months {m >= 12 ? `(${m / 12} yr${m > 12 ? 's' : ''})` : ''}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Loan Purpose</label>
            <select className="form-input" name="purpose" value={form.purpose} onChange={handle} required>
              <option value="">Select purpose</option>
              {purposes.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Additional Details (optional)</label>
            <textarea className="form-input" name="description" rows={3} placeholder="Briefly describe how you plan to use the loan..." value={form.description} onChange={handle} style={{ resize: 'vertical' }} />
          </div>

          <div style={{ background: '#f0fdf4', borderRadius: 8, padding: '0.75rem 1rem', fontSize: '0.8rem', color: '#166534' }}>
            ✅ By submitting, you agree to Ujima Sacco's loan terms and conditions.
          </div>

          <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading || amount < 5000}>
            {loading ? '⏳ Submitting...' : '📤 Submit Application'}
          </button>
        </form>
      </div>

      {/* Loan Calculator Summary */}
      <div style={{ width: 280, flexShrink: 0 }}>
        <div className="card" style={{ background: 'var(--primary-dark)', color: '#fff' }}>
          <h4 style={{ fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            🧮 Loan Summary
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {[
              { label: 'Principal', value: formatKES(amount) },
              { label: 'Interest Rate', value: '12% p.a.' },
              { label: 'Duration', value: `${duration} months` },
              { label: 'Monthly Payment', value: formatKES(monthly), highlight: true },
              { label: 'Total Interest', value: formatKES(totalInterest) },
              { label: 'Total Repayment', value: formatKES(totalRepay), bold: true },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: item.highlight ? '0.5rem 0.75rem' : '0', background: item.highlight ? 'rgba(255,255,255,0.1)' : 'transparent', borderRadius: item.highlight ? 8 : 0 }}>
                <span style={{ fontSize: '0.8rem', opacity: 0.75 }}>{item.label}</span>
                <span style={{ fontWeight: item.bold ? 700 : 600, fontSize: item.bold ? '1rem' : '0.9rem' }}>{value_or_zero(item.value)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ marginTop: '1rem' }}>
          <h4 style={{ fontWeight: 700, marginBottom: '0.75rem', fontSize: '0.9rem' }}>Your Account</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Member No.</span>
              <span style={{ fontWeight: 600 }}>{user?.memberNumber}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Savings</span>
              <span style={{ fontWeight: 600, color: 'var(--success)' }}>{formatKES(user?.savings || 0)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function value_or_zero(v) {
  if (!v || v === 'KES 0' || v === 'KES\u00a00') return '—';
  return v;
}
