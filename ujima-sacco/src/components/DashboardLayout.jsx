import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';

export default function DashboardLayout({ children, title }) {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dashboard-layout">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 99 }}
        />
      )}

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="main-content">
        <div className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              className="btn btn-sm"
              style={{ display: 'none', background: 'transparent', border: '1px solid var(--border)', padding: '0.4rem 0.6rem' }}
              onClick={() => setSidebarOpen(true)}
              id="menu-btn"
            >
              ☰
            </button>
            <div>
              <h1 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{title}</h1>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ textAlign: 'right', display: 'none' }} className="user-info-desktop">
              <div style={{ fontSize: '0.825rem', fontWeight: 600 }}>{user?.fullName}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{user?.memberNumber}</div>
            </div>
            <div className="avatar" style={{ width: 38, height: 38 }}>{user?.fullName?.charAt(0)}</div>
          </div>
        </div>

        <div className="page-content">
          {children}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #menu-btn { display: flex !important; }
        }
        @media (min-width: 769px) {
          .user-info-desktop { display: block !important; }
        }
      `}</style>
    </div>
  );
}
