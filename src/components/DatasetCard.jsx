import { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import './DatasetCard.css';

const CATEGORY_ICONS = {
  Images:  '🖼',
  Text:    '📝',
  Audio:   '🎵',
  Tabular: '📊',
  Other:   '📦',
};

function truncateAddr(addr) {
  if (!addr) return '';
  if (addr.length <= 12) return addr;
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export default function DatasetCard({ dataset }) {
  const { wallet, connect } = useWallet();
  const { recordDownload } = useData();
  const { addToast } = useToast();
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async (e) => {
    e.stopPropagation();
    if (!wallet) {
      const ok = await connect();
      if (!ok) return;
    }
    setDownloading(true);
    try {
      // Simulate Shelby storage retrieval + Aptos payment
      await new Promise(r => setTimeout(r, 1800));
      recordDownload(dataset.id);
      addToast(`Payment of ${dataset.price} ShelbyUSD sent · Download starting`, 'success', '⬇');
    } catch {
      addToast('Transaction failed. Please try again.', 'error');
    } finally {
      setDownloading(false);
    }
  };

  const icon = CATEGORY_ICONS[dataset.category] || '📦';

  return (
    <div className="card dataset-card" id={`dataset-${dataset.id}`}>
      <div className="dataset-card-header">
        <div>
          <div className="dataset-card-name">{dataset.name}</div>
          <div style={{ marginTop: 8 }}>
            <span className="tag">{dataset.category}</span>
          </div>
        </div>
        <div className="badge-icon">{icon}</div>
      </div>

      <p className="dataset-card-desc">{dataset.description}</p>

      <div className="dataset-card-meta">
        <span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
            <polyline points="13 2 13 9 20 9"/>
          </svg>
          {dataset.size}
        </span>
        <span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          {dataset.downloads} downloads
        </span>
        <span className="wallet-addr">{truncateAddr(dataset.uploader)}</span>
      </div>

      <div className="dataset-card-footer">
        <div>
          <div className="dataset-price">
            {dataset.price}
            <span>ShelbyUSD</span>
          </div>
        </div>
        <button
          className="btn btn-primary btn-sm"
          onClick={handleDownload}
          disabled={downloading}
          id={`download-btn-${dataset.id}`}
        >
          {downloading ? (
            <>
              <span className="spinner" style={{ width: 12, height: 12 }} />
              Paying...
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Download
            </>
          )}
        </button>
      </div>
    </div>
  );
}
