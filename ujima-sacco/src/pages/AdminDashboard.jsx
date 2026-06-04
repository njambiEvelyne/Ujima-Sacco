import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { getLoans, getUsers, updateLoanStatus, saveUsers, formatKES } from '../data/store';

/* ── Overview ─────────────────────────────────────────────────────── */
function AdminOverview() {
  const loans = getLoans();
  const users = getUsers().filter(u => u.role === 'member');
  const pending = loans.filter(l => l.status === 'pending');
  const approved = loans.filter(l => l.status === 'approved');
  const rejected = loans.filter(l => l.status === 'rejected');
  const totalDisbursed = approved.reduce((s, l) => s + l.amount, 0);
  const totalSavings = users.reduce((s, u) => s + (u.savings || 0), 0);

  const stats = [
    { icon: '👥', bg: '#dbeafe', label: 'Total Members', value: users.length },
    { icon: '⏳', bg: '#fef3c7', label: 'Pending Loans', value: pending.length },
    { icon: '✅', bg: '#dcfce7', label: 'Approved Loans', value: approved.length },
    { icon: '💰', bg: '#f0fdf4', label: 'Total Disbursed', value: formatKES(totalDisbursed) },
    { icon: '🏦', bg: '#ede9fe', label: 'Total Savings', value: formatKES(totalSavings) },
    { icon: '❌', bg: '#fee2e2', label: 'Rejected Loans', value: rejected.length },
  ];

  const recentLoans = [...loans]
    .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt))
    .slice(0, 5);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div style={{ background: 'linear-gradient(135deg, var(--primary-dark), var(--primary))', borderRadius: 'var(--radius)', padding: '2rem', color: '#fff' }}>
        <div style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: '0.25rem' }}>Admin Portal</div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>📊 Dashboard Overview</h2>
        <div style={{ marginTop: '0.25rem', fontSize: '0.8rem', opacity: 0.7 }}>
          {new Date().toLocaleDateString('en-KE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      <div className="stats-grid">
        {stats.map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon" style={{ background: s.bg }}>{s.icon}</div>
            <div className="stat-info">
              <h3>{s.value}</h3>
              <p>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <h3 style={{ fontWeight: 700 }}>Recent Loan Applications</h3>
          <a href="/admin/loans" className="btn btn-outline btn-sm">View All</a>
        </div>
        {recentLoans.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📋</div>
            <h3>No loan applications yet</h3>
            <p>Applications will appear here once members submit them</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)' }}>
                  {['Member', 'Amount', 'Purpose', 'Applied', 'Status'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '0.5rem 0.75rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentLoans.map(loan => (
                  <tr key={loan.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.75rem' }}>
                      <div style={{ fontWeight: 600 }}>{loan.memberName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{loan.memberNumber}</div>
                    </td>
                    <td style={{ padding: '0.75rem', fontWeight: 600 }}>{formatKES(loan.amount)}</td>
                    <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>{loan.purpose}</td>
                    <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>{new Date(loan.appliedAt).toLocaleDateString()}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span className={`badge badge-${loan.status}`}>{loan.status.toUpperCase()}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Loan Applications ────────────────────────────────────────────── */
function LoanApplications() {
  const [loans, setLoans] = useState(getLoans);
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [note, setNote] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = loans
    .filter(l => filter === 'all' || l.status === filter)
    .filter(l => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        l.memberName?.toLowerCase().includes(q) ||
        l.memberNumber?.toLowerCase().includes(q) ||
        l.purpose?.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));

  const handleAction = (loanId, status) => {
    setActionLoading(true);
    setTimeout(() => {
      updateLoanStatus(loanId, status, note);
      setLoans(getLoans());
      setSelected(null);
      setNote('');
      setActionLoading(false);
    }, 500);
  };

  const tabs = [
    { key: 'all', label: 'All', count: loans.length },
    { key: 'pending', label: 'Pending', count: loans.filter(l => l.status === 'pending').length },
    { key: 'approved', label: 'Approved', count: loans.filter(l => l.status === 'approved').length },
    { key: 'rejected', label: 'Rejected', count: loans.filter(l => l.status === 'rejected').length },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h2 style={{ fontWeight: 700 }}>Loan Applications</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Review and manage member loan applications</p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setFilter(t.key)}
              className={`btn btn-sm ${filter === t.key ? 'btn-primary' : 'btn-outline'}`}
            >
              {t.label} <span style={{ marginLeft: '0.35rem', opacity: 0.75 }}>({t.count})</span>
            </button>
          ))}
        </div>
        <input
          className="form-input"
          placeholder="🔍 Search by name, number..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: 240, padding: '0.45rem 0.75rem', fontSize: '0.875rem' }}
        />
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {filtered.length === 0 ? (
          <div className="empty-state" style={{ padding: '3rem' }}>
            <div className="icon">📋</div>
            <h3>No applications found</h3>
            <p>Try adjusting your filter or search</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid var(--border)' }}>
                  {['Member', 'Amount', 'Purpose', 'Duration', 'Monthly', 'Applied', 'Status', 'Action'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '0.75rem 1rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(loan => (
                  <tr key={loan.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <div style={{ fontWeight: 600 }}>{loan.memberName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{loan.memberNumber}</div>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>{formatKES(loan.amount)}</td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>{loan.purpose}</td>
                    <td style={{ padding: '0.75rem 1rem', whiteSpace: 'nowrap' }}>{loan.duration} mo</td>
                    <td style={{ padding: '0.75rem 1rem', whiteSpace: 'nowrap' }}>{formatKES(loan.monthlyPayment)}</td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{new Date(loan.appliedAt).toLocaleDateString()}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span className={`badge badge-${loan.status}`}>{loan.status.toUpperCase()}</span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      {loan.status === 'pending' ? (
                        <button className="btn btn-sm btn-primary" onClick={() => { setSelected(loan); setNote(''); }}>
                          Review
                        </button>
                      ) : (
                        <button className="btn btn-sm btn-outline" onClick={() => { setSelected(loan); setNote(loan.adminNote || ''); }}>
                          View
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="card fade-in" style={{ width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontWeight: 700 }}>Loan Application Details</h3>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: 'var(--text-muted)' }}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem', marginBottom: '1.25rem' }}>
              {[
                { label: 'Member Name', value: selected.memberName },
                { label: 'Member No.', value: selected.memberNumber },
                { label: 'Email', value: selected.email },
                { label: 'Phone', value: selected.phone },
                { label: 'Loan Amount', value: formatKES(selected.amount) },
                { label: 'Duration', value: `${selected.duration} months` },
                { label: 'Monthly Payment', value: formatKES(selected.monthlyPayment) },
                { label: 'Interest Rate', value: `${selected.interestRate}% p.a.` },
                { label: 'Purpose', value: selected.purpose },
                { label: 'Applied On', value: new Date(selected.appliedAt).toLocaleDateString() },
              ].map(f => (
                <div key={f.label} style={{ background: '#f8fafc', borderRadius: 8, padding: '0.65rem 0.875rem' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.2rem' }}>{f.label}</div>
                  <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>{f.value}</div>
                </div>
              ))}
            </div>
            {selected.description && (
              <div style={{ background: '#f8fafc', borderRadius: 8, padding: '0.75rem 1rem', marginBottom: '1.25rem', fontSize: '0.875rem' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.4rem' }}>Description</div>
                {selected.description}
              </div>
            )}
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label">Admin Note (optional)</label>
              <textarea
                className="form-input"
                rows={3}
                placeholder="Add a note for the member..."
                value={note}
                onChange={e => setNote(e.target.value)}
                style={{ resize: 'vertical' }}
                disabled={selected.status !== 'pending'}
              />
            </div>
            {selected.status === 'pending' ? (
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  className="btn btn-sm"
                  style={{ flex: 1, background: '#fee2e2', color: '#991b1b', border: 'none', fontWeight: 600 }}
                  onClick={() => handleAction(selected.id, 'rejected')}
                  disabled={actionLoading}
                >
                  {actionLoading ? '...' : '❌ Reject'}
                </button>
                <button
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  onClick={() => handleAction(selected.id, 'approved')}
                  disabled={actionLoading}
                >
                  {actionLoading ? '...' : '✅ Approve'}
                </button>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '0.5rem', borderRadius: 8, background: selected.status === 'approved' ? '#dcfce7' : '#fee2e2', color: selected.status === 'approved' ? '#166534' : '#991b1b', fontWeight: 600, fontSize: '0.875rem' }}>
                {selected.status === 'approved' ? '✅ Approved' : '❌ Rejected'}
                {selected.reviewedAt ? ` · ${new Date(selected.reviewedAt).toLocaleDateString()}` : ''}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Members ─────────────────────────────────────────────────────── */
function Members() {
  const [members, setMembers] = useState(() => getUsers().filter(u => u.role === 'member'));
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const filtered = members.filter(m => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      m.fullName?.toLowerCase().includes(q) ||
      m.email?.toLowerCase().includes(q) ||
      m.memberNumber?.toLowerCase().includes(q)
    );
  });

  const toggleStatus = (memberId) => {
    const allUsers = getUsers();
    const idx = allUsers.findIndex(u => u.id === memberId);
    if (idx === -1) return;
    allUsers[idx].status = allUsers[idx].status === 'active' ? 'suspended' : 'active';
    saveUsers(allUsers);
    const updated = allUsers.filter(u => u.role === 'member');
    setMembers(updated);
    if (selected?.id === memberId) setSelected(allUsers[idx]);
  };

  const memberLoans = selected ? getLoans().filter(l => l.userId === selected.id) : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontWeight: 700 }}>Members</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{members.length} registered members</p>
        </div>
        <input
          className="form-input"
          placeholder="🔍 Search members..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: 240, padding: '0.45rem 0.75rem', fontSize: '0.875rem' }}
        />
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {filtered.length === 0 ? (
          <div className="empty-state" style={{ padding: '3rem' }}>
            <div className="icon">👥</div>
            <h3>No members found</h3>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid var(--border)' }}>
                  {['Member', 'Contact', 'Member No.', 'Savings', 'Joined', 'Status', 'Action'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '0.75rem 1rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(m => (
                  <tr key={m.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div className="avatar" style={{ width: 34, height: 34, fontSize: '0.9rem', flexShrink: 0 }}>{m.fullName?.charAt(0)}</div>
                        <div style={{ fontWeight: 600 }}>{m.fullName}</div>
                      </div>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <div style={{ fontSize: '0.8rem' }}>{m.email}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{m.phone}</div>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{m.memberNumber}</td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--success)', fontWeight: 600 }}>{formatKES(m.savings || 0)}</td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{new Date(m.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span className={`badge ${m.status === 'active' ? 'badge-approved' : 'badge-rejected'}`}>{m.status?.toUpperCase()}</span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <button className="btn btn-sm btn-outline" onClick={() => setSelected(m)}>View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="card fade-in" style={{ width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontWeight: 700 }}>Member Details</h3>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: 'var(--text-muted)' }}>✕</button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'linear-gradient(135deg, var(--primary-dark), var(--primary))', borderRadius: 'var(--radius)', padding: '1.25rem', color: '#fff', marginBottom: '1.25rem' }}>
              <div className="avatar" style={{ width: 52, height: 52, fontSize: '1.4rem', background: 'rgba(255,255,255,0.2)', flexShrink: 0 }}>{selected.fullName?.charAt(0)}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{selected.fullName}</div>
                <div style={{ opacity: 0.8, fontSize: '0.8rem' }}>{selected.memberNumber} · {selected.email}</div>
              </div>
              <span className={`badge ${selected.status === 'active' ? 'badge-approved' : 'badge-rejected'}`} style={{ marginLeft: 'auto' }}>{selected.status?.toUpperCase()}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
              {[
                { label: 'Phone', value: selected.phone },
                { label: 'ID / Passport', value: selected.idNumber },
                { label: 'Date of Birth', value: selected.dob },
                { label: 'Gender', value: selected.gender },
                { label: 'Address', value: selected.address },
                { label: 'Savings', value: formatKES(selected.savings || 0) },
                { label: 'Member Since', value: new Date(selected.createdAt).toLocaleDateString() },
                { label: 'Total Loans', value: memberLoans.length },
              ].map(f => (
                <div key={f.label} style={{ background: '#f8fafc', borderRadius: 8, padding: '0.65rem 0.875rem' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.2rem' }}>{f.label}</div>
                  <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>{f.value || '—'}</div>
                </div>
              ))}
            </div>
            {memberLoans.length > 0 && (
              <div style={{ marginBottom: '1.25rem' }}>
                <h4 style={{ fontWeight: 700, marginBottom: '0.75rem', fontSize: '0.9rem' }}>Loan History</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {memberLoans.map(l => (
                    <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0.875rem', background: '#f8fafc', borderRadius: 8, fontSize: '0.8rem' }}>
                      <div>
                        <span style={{ fontWeight: 600 }}>{formatKES(l.amount)}</span>
                        <span style={{ color: 'var(--text-muted)', marginLeft: '0.5rem' }}>{l.purpose}</span>
                      </div>
                      <span className={`badge badge-${l.status}`}>{l.status.toUpperCase()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <button
              className="btn w-full"
              style={{ background: selected.status === 'active' ? '#fee2e2' : '#dcfce7', color: selected.status === 'active' ? '#991b1b' : '#166534', border: 'none', fontWeight: 600 }}
              onClick={() => toggleStatus(selected.id)}
            >
              {selected.status === 'active' ? '🚫 Suspend Member' : '✅ Activate Member'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Main Export ─────────────────────────────────────────────────── */
export default function AdminDashboard() {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout title="Admin Overview"><AdminOverview /></DashboardLayout>} />
      <Route path="/loans" element={<DashboardLayout title="Loan Applications"><LoanApplications /></DashboardLayout>} />
      <Route path="/members" element={<DashboardLayout title="Members"><Members /></DashboardLayout>} />
    </Routes>
  );
}
