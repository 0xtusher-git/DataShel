import { Link } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { useData } from '../context/DataContext';
import DatasetCard from '../components/DatasetCard';
import './Home.css';

function AnimatedHexBg() {
  return (
    <div className="hero-bg" aria-hidden="true">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className={`hex-orb hex-orb-${i + 1}`} />
      ))}
    </div>
  );
}

export default function Home() {
  const { wallet, connect, connecting } = useWallet();
  const { datasets, totalStats } = useData();
  const featured = datasets.slice(0, 3);

  return (
    <div className="home-page">
      {/* ── Hero ── */}
      <section className="hero-section">
        <AnimatedHexBg />
        <div className="container hero-content">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            Live on Shelbynet Testnet
          </div>

          <h1 className="hero-headline">
            Your Data.<br />
            Your Price.<br />
            <span className="hero-headline-pink">Stored on Shelby.</span>
          </h1>

          <p className="hero-subheadline">
            Upload AI training datasets, set your price, earn ShelbyUSD
            every time someone downloads.
          </p>

          <div className="hero-ctas">
            <Link to="/upload" className="btn btn-primary btn-lg" id="hero-upload-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              Upload Dataset
            </Link>
            <Link to="/browse" className="btn btn-outline btn-lg" id="hero-browse-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              Browse Datasets
            </Link>
          </div>

          {/* Stat bar */}
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-value" id="stat-listed">{totalStats.listed.toLocaleString()}</span>
              <span className="stat-label">Datasets Listed</span>
            </div>
            <span className="stat-dot">·</span>
            <div className="stat-item">
              <span className="stat-value" id="stat-downloads">{totalStats.downloads.toLocaleString()}</span>
              <span className="stat-label">Total Downloads</span>
            </div>
            <span className="stat-dot">·</span>
            <div className="stat-item">
              <span className="stat-value" style={{ color: 'var(--pink)', fontSize: '1rem' }}>Shelbynet</span>
              <span className="stat-label">Powered by</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="how-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">How DataShel Works</h2>
          </div>
          <div className="how-grid">
            {[
              {
                icon: '⬆',
                title: 'Upload',
                desc: 'Drag and drop your AI training data. DataShel stores it on Shelby Protocol — decentralized, permanent, tamper-proof.',
              },
              {
                icon: '🏷',
                title: 'Set a Price',
                desc: 'Name your price in ShelbyUSD. You control the economics. Update it any time from your dashboard.',
              },
              {
                icon: '💸',
                title: 'Earn',
                desc: 'Every download triggers an on-chain payment direct to your wallet. No middlemen, no fees taken by us.',
              },
            ].map((step, i) => (
              <div key={i} className="how-card card">
                <div className="how-icon">{step.icon}</div>
                <h3 className="how-title">{step.title}</h3>
                <p className="how-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Datasets ── */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Datasets</h2>
            <Link to="/browse" className="btn btn-ghost btn-sm">View all →</Link>
          </div>
          <div className="dataset-grid">
            {featured.map(ds => (
              <DatasetCard key={ds.id} dataset={ds} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Protocol Banner ── */}
      <section className="protocol-banner">
        <div className="container protocol-inner">
          <div className="protocol-text">
            <h2>Built on Shelby Protocol</h2>
            <p>
              Shelby is a decentralized storage network built on Aptos. DataShel uses Shelby SDK
              to store datasets on-chain — content-addressed, immutable, and globally accessible.
            </p>
          </div>
          <div className="protocol-links">
            <a href="https://shelby.xyz" target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">
              Shelby Protocol →
            </a>
            <a href="https://docs.shelby.xyz" target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm">
              Documentation →
            </a>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      {!wallet && (
        <section className="cta-section">
          <div className="container cta-inner">
            <div className="cta-text">
              <h2>Ready to monetize your data?</h2>
              <p className="hero-subheadline" style={{ fontSize: '0.9rem', marginTop: 8 }}>
                Connect your Petra wallet and start uploading in under 2 minutes.
              </p>
            </div>
            <button
              className="btn btn-primary btn-lg"
              onClick={connect}
              disabled={connecting}
              id="cta-connect-btn"
            >
              {connecting ? 'Connecting...' : 'Connect Petra Wallet'}
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
