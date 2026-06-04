import React from 'react';
import { useAuth } from '../context/AuthContext';
import { formatKES } from '../data/store';

export default function UserProfile() {
  const { user } = useAuth();

  const fields = [
    { label: 'Full Name', value: user?.fullName },
    { label: 'Email Address', value: user?.email },
    { label: 'Phone Number', value: user?.phone },
    { label: 'ID / Passport', value: user?.idNumber },
    { label: 'Date of Birth', value: user?.dob },
    { label: 'Gender', value: user?.gender },
    { label: 'Address', value: user?.address },
    { label: 'Member Number', value: user?.memberNumber },
    { label: 'Account Status', value: user?.status?.toUpperCase() },
    { label: 'Member Since', value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-KE', { year: 'numeric', month: 'long', day: 'numeric' }) : '—' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: 700 }}>
      {/* Header card */}
      <div style={{ background: 'linear-gradient(135deg, var(--primary-dark), var(--primary))', borderRadius: 'var(--radius)', padding: '2rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ width: 72, height: 72, background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 800, flexShrink: 0 }}>
          {user?.fullName?.charAt(0)}
        </div>
        <div>
          <h2 style={{ fontWeight: 700, fontSize: '1.3rem' }}>{user?.fullName}</h2>
          <div style={{ opacity: 0.8, fontSize: '0.875rem' }}>{user?.memberNumber}</div>
          <div style={{ marginTop: '0.5rem', display: 'inline-block', background: 'rgba(255,255,255,0.15)', borderRadius: 20, padding: '0.2rem 0.75rem', fontSize: '0.75rem', fontWeight: 600 }}>
            ✅ Active Member
          </div>
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>Total Savings</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{formatKES(user?.savings || 0)}</div>
        </div>
      </div>

      {/* Profile fields */}
      <div className="card">
        <h3 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>Personal Information</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
          {fields.map(f => (
            <div key={f.label} style={{ padding: '0.875rem', background: '#f8fafc', borderRadius: 8 }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.3rem' }}>{f.label}</div>
              <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{f.value || '—'}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="alert alert-info">
        ℹ️ To update your profile information, please visit any Ujima Sacco branch or contact support at <strong>0800 723 456</strong>.
      </div>
    </div>
  );
}
