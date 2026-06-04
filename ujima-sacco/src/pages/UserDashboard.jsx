import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { getUserLoans, formatKES } from '../data/store';
import ApplyLoan from './ApplyLoan';
import UserProfile from './UserProfile';

function Overview() {
  const { user } = useAuth();
  const loans = getUserLoans(user?.id);
  const activeLoans = loans.filter(l => l.status === 'approved');
  const pendingLoans = loans.filter(l => l.status === 'pending');
  const totalBorrowed = activeLoans.reduce((s, l) => s + l.amount, 0);
  const totalRepaid = activeLoans.reduce((s, l) => s + (l.paidAmount || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Welcome */}
      <div style={{ background: 'linear-gradient(135deg, var(--primary-dark), var(--primary))', borderRadius: 'var(--radius)', padding: '2rem', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: '0.25rem' }}>Good day,</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>👋 {user?.fullName}</h2>
          <div style={{ marginTop: '0.25rem', fontSize: '0.8rem', opacity: 0.7 }}>Member No. {user?.memberNumber} · Joined {new Date(user?.createdAt).toLocaleDateString('en-KE', { year: 'numeric', month: 'long' })}</div>
        </div>
        <Link to="/dashboard/apply" className="btn btn-accent">+ Apply for Loan</Link>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#dcfce7' }}>💰</div>
          <div className="stat-info">
            <h3>{formatKES(user?.savings || 0)}</h3>
            <p>Total Savings</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#dbeafe' }}>📋</div>
          <div className="stat-info">
            <h3>{formatKES(totalBorrowed)}</h3>
            <p>Active Loans</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fef3c7' }}>⏳</div>
          <div className="stat-info">
            <h3>{pendingLoans.length}</h3>
            <p>Pending Applications</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#f0fdf4' }}>✅</div>
          <div className="stat-info">
            <h3>{formatKES(totalRepaid)}</h3>
            <p>Total Repaid</p>
          </div>
        </div>
      </div>

      {/* Recent loans */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <h3 style={{ fontWeight: 700 }}>Recent Loan Applications</h3>
          <Link to="/dashboard/loans" className="btn btn-outline btn-sm">View All</Link>
        </div>

        {loans.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📄</div>
            <h3>No loan applications yet</h3>
            <p style={{ marginBottom: '1rem' }}>Start your financial journey</p>
            <Link to="/dashboard/apply" className="btn btn-primary btn-sm">Apply Now</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {loans.slice(-3).reverse().map(loan => (
              <LoanRow key={loan.id} loan={loan} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function LoanRow({ loan }) {
  const statusColors = { pending: 'badge-pending', approved: 'badge-approved', rejected: 'badge-rejected' };
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: '#f8fafc', borderRadius: 8, flexWrap: 'wrap', gap: '0.5rem' }}>
      <div>
        <div style={{ fontWeight: 600, marginBottom: '0.2rem' }}>{formatKES(loan.amount)}</div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{loan.purpose} · {loan.duration} months</div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <span className={`badge ${statusColors[loan.status] || 'badge-pending'}`}>{loan.status}</span>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
          {new Date(loan.appliedAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}

function MyLoans() {
  const { user } = useAuth();
  const loans = getUserLoans(user?.id);
  const statusClass = { pending: 'pending', approved: 'approved', rejected: 'rejected' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontWeight: 700 }}>My Loans</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>All your loan applications and their status</p>
        </div>
        <Link to="/dashboard/apply" className="btn btn-primary">+ New Application</Link>
      </div>

      {loans.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="icon">💳</div>
            <h3>No loans yet</h3>
            <p style={{ marginBottom: '1rem' }}>Apply for your first loan today</p>
            <Link to="/dashboard/apply" className="btn btn-primary">Apply Now</Link>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[...loans].reverse().map(loan => (
            <div key={loan.id} className={`loan-card ${statusClass[loan.status] || ''}`}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <div className="loan-amount">{formatKES(loan.amount)}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{loan.purpose}</div>
                </div>
                <span className={`badge badge-${loan.status}`}>{loan.status.toUpperCase()}</span>
              </div>
              <div className="loan-meta">
                <div className="loan-meta-item"><strong>{loan.duration} months</strong>Duration</div>
                <div className="loan-meta-item"><strong>{formatKES(loan.monthlyPayment)}</strong>Monthly Payment</div>
                <div className="loan-meta-item"><strong>{loan.interestRate}% p.a.</strong>Interest Rate</div>
                <div className="loan-meta-item"><strong>{new Date(loan.appliedAt).toLocaleDateString()}</strong>Applied</div>
              </div>
              {loan.adminNote && (
                <div style={{ marginTop: '0.75rem', padding: '0.65rem 0.875rem', background: loan.status === 'rejected' ? '#fee2e2' : '#dcfce7', borderRadius: 8, fontSize: '0.8rem', color: loan.status === 'rejected' ? '#991b1b' : '#166534' }}>
                  💬 <strong>Admin Note:</strong> {loan.adminNote}
                </div>
              )}
              {loan.status === 'approved' && (
                <div style={{ marginTop: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                    <span>Repayment Progress</span>
                    <span>{formatKES(loan.paidAmount || 0)} / {formatKES(loan.amount)}</span>
                  </div>
                  <div className="progress-bar-wrap">
                    <div className="progress-bar-fill" style={{ width: `${Math.min(100, ((loan.paidAmount || 0) / loan.amount) * 100)}%` }} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function UserDashboard() {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout title="Member Dashboard"><Overview /></DashboardLayout>} />
      <Route path="/loans" element={<DashboardLayout title="My Loans"><MyLoans /></DashboardLayout>} />
      <Route path="/apply" element={<DashboardLayout title="Apply for Loan"><ApplyLoan /></DashboardLayout>} />
      <Route path="/profile" element={<DashboardLayout title="My Profile"><UserProfile /></DashboardLayout>} />
    </Routes>
  );
}
