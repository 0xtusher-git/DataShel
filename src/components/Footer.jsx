import { Link } from 'react-router-dom';
import Logo from './Logo';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <Logo size={24} textSize="0.95rem" />
          <p className="footer-tagline">
            Decentralized AI training data marketplace<br/>
            powered by Shelby Protocol.
          </p>
          <div className="footer-network">
            <span className="network-dot-sm" />
            Running on Shelbynet Testnet
          </div>
        </div>

        <div className="footer-cols">
          <div className="footer-col">
            <h4>Marketplace</h4>
            <Link to="/browse">Browse Datasets</Link>
            <Link to="/upload">Upload Dataset</Link>
            <Link to="/my-datasets">My Datasets</Link>
          </div>
          <div className="footer-col">
            <h4>Resources</h4>
            <a href="https://docs.shelby.xyz" target="_blank" rel="noreferrer">Shelby Docs</a>
            <a href="https://docs.shelby.xyz/tools/wallets/petra-setup" target="_blank" rel="noreferrer">Petra Setup</a>
            <a href="https://faucet.shelby.xyz" target="_blank" rel="noreferrer">Faucet</a>
          </div>
          <div className="footer-col">
            <h4>Protocol</h4>
            <a href="https://shelby.xyz" target="_blank" rel="noreferrer">Shelby Protocol</a>
            <a href="https://explorer.shelby.xyz" target="_blank" rel="noreferrer">Explorer</a>
            <a href="https://github.com" target="_blank" rel="noreferrer">GitHub</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <span>© 2025 DataShel. Built on Shelby Protocol.</span>
          <span className="footer-legal">
            An ecosystem project — not officially affiliated with Shelby Protocol Ltd.
          </span>
        </div>
      </div>
    </footer>
  );
}
