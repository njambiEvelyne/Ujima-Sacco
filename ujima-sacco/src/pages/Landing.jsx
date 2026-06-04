import React from 'react';
import { Link } from 'react-router-dom';

const features = [
  { icon: '💰', color: '#dcfce7', label: 'Flexible Loans', desc: 'Access loans from KES 5,000 to KES 2,000,000 at competitive rates.' },
  { icon: '⚡', color: '#fef3c7', label: 'Fast Approval', desc: 'Get loan decisions within 24 hours, straight to your dashboard.' },
  { icon: '🔒', color: '#dbeafe', label: 'Secure & Trusted', desc: 'Bank-grade security protecting your data and transactions.' },
  { icon: '📱', color: '#fce7f3', label: 'Easy Management', desc: 'Track loans, repayments and savings anytime, anywhere.' },
  { icon: '🤝', color: '#ede9fe', label: 'Member Focused', desc: 'Member-owned cooperative that puts your interests first.' },
  { icon: '📊', color: '#ffedd5', label: 'Transparent Rates', desc: '12% p.a. interest — no hidden fees or surprises.' },
];

const stats = [
  { value: '12,000+', label: 'Active Members' },
  { value: 'KES 500M+', label: 'Loans Disbursed' },
  { value: '98%', label: 'Satisfaction Rate' },
  { value: '15 Yrs', label: 'Serving Communities' },
];

export default function Landing() {
  return (
    <div>
      {/* Navbar */}
      <nav className="landing-nav">
        <div className="nav-brand">
          <div className="nav-logo">U</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--primary)' }}>Ujima Sacco</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Empowering Communities</div>
          </div>
        </div>
        <div className="flex gap-3 items-center">
          <Link to="/login" className="btn btn-outline btn-sm">Sign In</Link>
          <Link to="/register" className="btn btn-primary btn-sm">Join Now</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-content fade-in">
          <div className="hero-badge">🏆 Kenya's Most Trusted SACCO</div>
          <h1>Financial Freedom<br />Starts Here</h1>
          <p>Join Ujima Sacco and access affordable loans, grow your savings, and build a stronger financial future for you and your family.</p>
          <div className="hero-cta">
            <Link to="/register" className="btn btn-accent btn-lg">Get Started Today</Link>
            <Link to="/login" className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '2px solid rgba(255,255,255,0.3)' }}>
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <div style={{ background: 'var(--primary)', padding: '2.5rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', maxWidth: 900, margin: '0 auto' }}>
          {stats.map(s => (
            <div key={s.label} style={{ textAlign: 'center', color: '#fff' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{s.value}</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.75 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <section className="features-section">
        <div className="section-header">
          <h2>Why Choose Ujima?</h2>
          <p>We combine community values with modern banking to give you the best of both worlds.</p>
        </div>
        <div className="features-grid">
          {features.map(f => (
            <div className="feature-card" key={f.label}>
              <div className="feature-icon" style={{ background: f.color }}>{f.icon}</div>
              <h3>{f.label}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '5rem 2rem', background: '#fff' }}>
        <div className="section-header">
          <h2>How It Works</h2>
          <p>Get your loan in three simple steps.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem', maxWidth: 800, margin: '0 auto' }}>
          {[
            { step: '01', title: 'Create Account', desc: 'Register online in minutes with your ID and basic details.' },
            { step: '02', title: 'Apply for Loan', desc: 'Choose your amount and repayment period. Submit your application.' },
            { step: '03', title: 'Receive Funds', desc: 'Once approved, funds are disbursed directly to your account.' },
          ].map(s => (
            <div key={s.step} style={{ textAlign: 'center', padding: '1.5rem' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.2rem', margin: '0 auto 1rem' }}>{s.step}</div>
              <h3 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>{s.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <h2>Ready to Join Ujima Sacco?</h2>
        <p>Over 12,000 members already benefit. It's your turn.</p>
        <Link to="/register" className="btn btn-accent btn-lg">Create Free Account</Link>
      </section>

      <footer>
        <p>© 2025 Ujima Sacco · Empowering Communities · Regulated by SASRA</p>
      </footer>
    </div>
  );
}
