// Sidebar.jsx - Responsive sidebar navigation for the app
// Includes links to all main pages and logout button

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaHistory, FaChartPie, FaFileUpload, FaCog, FaUser, FaWallet, FaMoneyBillWave } from 'react-icons/fa';
import { FaSignOutAlt } from 'react-icons/fa';
import './Sidebar.css';


const Sidebar = () => {
  // State for sidebar open/close
  const [open, setOpen] = useState(false);

  // Set light theme by default
  useEffect(() => {
    document.body.setAttribute('data-theme', '');
    localStorage.setItem('theme', 'light');
  }, []);

  // Close sidebar on window resize for better UX
  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener('resize', close);
    return () => window.removeEventListener('resize', close);
  }, []);

  // Close sidebar when clicking overlay
  const handleOverlayClick = () => setOpen(false);

  return (
    <>
      {/* Hamburger button for mobile sidebar */}
      <button className="sidebar-hamburger" onClick={() => setOpen(o => !o)} aria-label="Open sidebar">
        <span></span>
        <span></span>
        <span></span>
      </button>
      {/* Overlay for closing sidebar on mobile */}
      {open && <div className="sidebar-overlay" onClick={handleOverlayClick}></div>}
      <div className={`sidebar${open ? ' open' : ''}`} style={{ ...styles.sidebar, background: 'var(--sidebar-bg)', color: 'var(--sidebar-text)' }}>
        <h2 style={styles.title}><FaMoneyBillWave style={{marginRight: 8}} /> Money Map</h2>
        <nav style={styles.nav}>
          {/* Navigation links */}
          <Link to="/dashboard" className="sidebar-link" style={styles.link} onClick={() => setOpen(false)}><FaPlus />Dashboard</Link>
          <Link to="/history" className="sidebar-link" style={styles.link} onClick={() => setOpen(false)}><FaHistory /> View History</Link>
          <Link to="/summary" className="sidebar-link" style={styles.link} onClick={() => setOpen(false)}><FaChartPie /> Summary / Graphs</Link>
          <Link to="/budgets" className="sidebar-link" style={styles.link} onClick={() => setOpen(false)}><FaWallet /> Budget Management</Link>
          <Link to="/receipt" className="sidebar-link" style={styles.link} onClick={() => setOpen(false)}><FaFileUpload /> Receipt Upload</Link>
          <Link to="/settings" className="sidebar-link" style={styles.link} onClick={() => setOpen(false)}><FaCog /> Settings</Link>
          <Link to="/profile" className="sidebar-link" style={styles.link} onClick={() => setOpen(false)}><FaUser /> Profile</Link>
        </nav>
        {/* Red logout button */}
        <div style={{ marginTop: 20, marginBottom: 40, textAlign: 'center' }}>
          <button
            onClick={async () => {
              await fetch('http://localhost:5000/auth/logout', {
                method: 'POST',
                credentials: 'include',
              });
              window.location.href = '/auth';
              setOpen(false);
            }}
            style={{
              background: '#dc3545',
              color: 'white',
              border: '1.5px solid #dc3545',
              borderRadius: 8,
              padding: '12px 22px',
              fontWeight: 700,
              fontSize: '1.08rem',
              letterSpacing: '0.01em',
              cursor: 'pointer',
              marginTop: 10,
              width: '100%',
              transition: 'background 0.2s, border 0.2s, transform 0.1s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#c82333';
              e.target.style.borderColor = '#c82333';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#dc3545';
              e.target.style.borderColor = '#dc3545';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>
      {/* No change needed here for main-content, handled in Dashboard.jsx and CSS. */}
    </>
  );
};

const styles = {
  sidebar: {
    width: '220px',
    height: '100vh',
    background: 'var(--sidebar-bg)',
    color: 'var(--sidebar-text)',
    padding: '20px',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 100,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minWidth: 180,
  },
  title: {
    color: '#4fc3f7',
    marginBottom: '40px',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  link: {
    color: 'var(--sidebar-text)',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontWeight: 500,
    fontSize: 16,
    padding: '8px 0',
    borderRadius: 6,
    transition: 'background 0.2s',
  },
};

export default Sidebar;
