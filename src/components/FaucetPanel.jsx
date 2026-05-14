import './FaucetPanel.css';

export default function FaucetPanel({ compact = false }) {
  return (
    <div className={`faucet-panel ${compact ? 'compact' : ''}`} id="faucet-panel">
      <div className="faucet-header">
        <div className="faucet-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF69B4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22a8 8 0 0 0 8-8c0-4-4-8-8-14C8 6 4 10 4 14a8 8 0 0 0 8 8z"/>
            <line x1="12" y1="2" x2="12" y2="8"/>
            <line x1="9" y1="5" x2="15" y2="5"/>
          </svg>
        </div>
        <div>
          <h3 className="faucet-title">New to Shelbynet?</h3>
          <p className="faucet-sub">Get free testnet tokens to start uploading and downloading datasets.</p>
        </div>
      </div>

      <div className="faucet-steps">
        <div className="faucet-step">
          <div className="step-num">1</div>
          <div className="step-content">
            <span className="step-label">Install Petra Wallet</span>
            <a
              href="https://chromewebstore.google.com/detail/petra-aptos-wallet/ejjladinnckdgjemekebdpeokbikhfci"
              target="_blank"
              rel="noreferrer"
              className="step-link"
              id="petra-install-link"
            >
              Chrome Web Store →
            </a>
          </div>
        </div>

        <div className="faucet-step">
          <div className="step-num">2</div>
          <div className="step-content">
            <span className="step-label">Switch to Shelbynet</span>
            <a
              href="https://docs.shelby.xyz/tools/wallets/petra-setup"
              target="_blank"
              rel="noreferrer"
              className="step-link"
              id="shelby-setup-link"
            >
              Setup guide →
            </a>
          </div>
        </div>

        <div className="faucet-step">
          <div className="step-num">3</div>
          <div className="step-content">
            <span className="step-label">Claim APT + ShelbyUSD</span>
            <a
              href="https://faucet.shelby.xyz"
              target="_blank"
              rel="noreferrer"
              className="step-link faucet-cta"
              id="faucet-link"
            >
              Open Faucet →
            </a>
          </div>
        </div>
      </div>

      {!compact && (
        <div className="faucet-note">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          Testnet tokens have no real value. Use them freely to explore DataShel.
        </div>
      )}
    </div>
  );
}
