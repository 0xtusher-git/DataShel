import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import Logo from './Logo';
import './Navbar.css';

export default function Navbar() {
  const location = useLocation();
  const { wallet, connect, disconnect, connecting, truncate, error, isDetected } = useWallet();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/browse', label: 'Browse' },
    { to: '/upload', label: 'Upload' },
    { to: '/my-datasets', label: 'My Datasets' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {error && (
        <div className="error-banner">
          <div className="container error-banner-inner">
            <span className="error-banner-text">{error}</span>
            {error.includes('Wrong network') && (
              <a href="https://docs.shelby.xyz/tools/wallets/petra-setup" target="_blank" rel="noreferrer" className="error-banner-link">
                Setup Guide →
              </a>
            )}
            {error.includes('not detected') && (
              <a href="https://chromewebstore.google.com/detail/petra-aptos-wallet/ejjladinnckdgjemekebdpeokbikhfci" target="_blank" rel="noreferrer" className="error-banner-link">
                Install Petra →
              </a>
            )}
          </div>
        </div>
      )}
      
      <nav className="navbar">
        <div className="container navbar-inner">
          <Link to="/" className="navbar-logo" onClick={() => setMenuOpen(false)}>
            <Logo size={30} textSize="1.1rem" />
          </Link>

          {/* Desktop nav links */}
          <div className="navbar-links">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`navbar-link ${isActive(link.to) ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="navbar-actions-wrap">
            <div className="navbar-actions">
              {/* Network badge */}
              <div className={`network-badge ${wallet?.isWrongNetwork ? 'network-badge-error' : ''}`}>
                <span className={`network-dot ${wallet?.isWrongNetwork ? 'network-dot-error' : ''}`} />
                {wallet?.network || 'Shelbynet'}
              </div>

              {wallet ? (
                <div className="wallet-connected" onClick={disconnect} title="Click to disconnect">
                  <span className="wallet-connected-dot" />
                  <span className="wallet-connected-addr">{truncate(wallet.address)}</span>
                </div>
              ) : (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={connect}
                  disabled={connecting}
                  id="connect-wallet-btn"
                >
                  {connecting ? (
                    <>
                      <span className="spinner" style={{ width: 14, height: 14 }} />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="7" width="20" height="14" rx="2" />
                        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                        <line x1="12" y1="12" x2="12" y2="16" />
                        <line x1="10" y1="14" x2="14" y2="14" />
                      </svg>
                      Connect Wallet
                    </>
                  )}
                </button>
              )}

              {/* Mobile menu toggle */}
              <button
                className="menu-toggle"
                onClick={() => setMenuOpen(v => !v)}
                aria-label="Toggle menu"
              >
                <span className={`menu-icon ${menuOpen ? 'open' : ''}`} />
              </button>
            </div>
            
            {/* Debug Line */}
            <div className="navbar-debug">
              wallet detected: <span style={{ color: isDetected ? '#22c55e' : '#ef4444' }}>{isDetected ? 'yes' : 'no'}</span>, 
              current network: <span style={{ color: wallet?.isWrongNetwork ? '#ef4444' : '#f9a8d4' }}>{wallet?.network || 'none'}</span>
            </div>
          </div>
        </div>

        {/* Mobile drawer */}
        {menuOpen && (
          <div className="mobile-menu">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`mobile-link ${isActive(link.to) ? 'active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <hr className="divider" />
            {wallet ? (
              <button className="btn btn-ghost btn-sm btn-full" onClick={() => { disconnect(); setMenuOpen(false); }}>
                Disconnect {truncate(wallet.address)}
              </button>
            ) : (
              <button className="btn btn-primary btn-sm btn-full" onClick={() => { connect(); setMenuOpen(false); }}>
                Connect Wallet
              </button>
            )}
          </div>
        )}
      </nav>
    </>
  );
}
