import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const memberLinks = [
  { to: '/dashboard', icon: '🏠', label: 'Overview' },
  { to: '/dashboard/loans', icon: '💳', label: 'My Loans' },
  { to: '/dashboard/apply', icon: '📝', label: 'Apply for Loan' },
  { to: '/dashboard/activity', icon: '🕓', label: 'My Activity' },
  { to: '/dashboard/profile', icon: '👤', label: 'My Profile' },
];

const adminLinks = [
  { to: '/admin', icon: '📊', label: 'Overview' },
  { to: '/admin/loans', icon: '📋', label: 'Loan Applications' },
  { to: '/admin/members', icon: '👥', label: 'Members' },
  { to: '/admin/activity', icon: '🕓', label: 'Activity Log' },
];

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const links = user?.role === 'admin' ? adminLinks : memberLinks;

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-brand">
        <div className="sidebar-logo">U</div>
        <div>
          <h2>Ujima Sacco</h2>
          <span>{user?.role === 'admin' ? 'Admin Portal' : 'Member Portal'}</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-title">Navigation</div>
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/dashboard' || link.to === '/admin'}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <span className="icon">{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div className="avatar">{user?.fullName?.charAt(0)}</div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: '0.825rem', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.fullName}</div>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>{user?.memberNumber}</div>
          </div>
        </div>
        <button className="btn btn-sm w-full" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)' }} onClick={handleLogout}>
          🚪 Sign Out
        </button>
      </div>
    </aside>
  );
}
