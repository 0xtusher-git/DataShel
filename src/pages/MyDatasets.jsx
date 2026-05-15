import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import './MyDatasets.css';

function EditPriceModal({ dataset, onClose, onSave }) {
  const [price, setPrice] = useState(dataset.price);
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: '1.05rem' }}>Edit Price</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <p style={{ fontSize: '0.83rem', color: 'var(--text-dim)', marginBottom: 16 }}>
          Update the download price for <strong style={{ color: 'var(--white)' }}>{dataset.name}</strong>
        </p>
        <div className="form-group">
          <label htmlFor="edit-price">New Price (ShelbyUSD)</label>
          <input
            id="edit-price"
            type="number"
            min="0.01"
            step="0.01"
            className="input"
            value={price}
            onChange={e => setPrice(e.target.value)}
            autoFocus
          />
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          <button className="btn btn-ghost btn-sm" onClick={onClose} style={{ flex: 1 }}>Cancel</button>
          <button
            className="btn btn-primary btn-sm"
            style={{ flex: 1 }}
            onClick={() => onSave(Number(price))}
            disabled={!price || Number(price) <= 0}
            id="save-price-btn"
          >
            Save Price
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MyDatasets() {
  const { wallet, connect, connecting } = useWallet();
  const { datasets, updateDataset } = useData();
  const { addToast } = useToast();
  const [editTarget, setEditTarget] = useState(null);

  const myDatasets = wallet
    ? datasets.filter(d => {
        const myAddr = wallet?.address?.toString();
        return d.uploader === myAddr;
      })
    : [];

  const totalEarnings = myDatasets.reduce((s, d) => s + (Number(d.price || 0) * (d.downloads || 0)), 0);
  const totalDownloads = myDatasets.reduce((s, d) => s + (d.downloads || 0), 0);

  const handleSavePrice = (id, newPrice) => {
    updateDataset(id, { price: newPrice });
    setEditTarget(null);
    addToast('Price updated on-chain ✓', 'success', '💰');
  };

  if (!wallet) {
    return (
      <div className="page">
        <div className="container">
          <div className="empty-state" style={{ paddingTop: 100 }}>
            <div className="empty-state-icon">🔒</div>
            <h3>Connect your wallet</h3>
            <p>Connect your Petra wallet to see the datasets you've uploaded and your earnings.</p>
            <button className="btn btn-primary" onClick={connect} disabled={connecting} id="myds-connect-btn">
              {connecting ? 'Connecting…' : 'Connect Petra Wallet'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page myds-page">
      <div className="container">
        {/* Header */}
        <div className="myds-header">
          <div>
            <h1 className="myds-title">My Datasets</h1>
            <p className="myds-sub wallet-addr">{wallet?.address?.toString() || 'Connected'}</p>
          </div>
          <Link to="/upload" className="btn btn-primary btn-sm" id="myds-upload-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Upload New
          </Link>
        </div>

        {/* Earnings summary */}
        {myDatasets.length > 0 && (
          <div className="myds-stats">
            <div className="myds-stat-card card">
              <div className="myds-stat-label">Total Earnings</div>
              <div className="myds-stat-value">{(totalEarnings || 0).toLocaleString()}</div>
              <div className="myds-stat-unit">ShelbyUSD</div>
            </div>
            <div className="myds-stat-card card">
              <div className="myds-stat-label">Total Downloads</div>
              <div className="myds-stat-value">{(totalDownloads || 0).toLocaleString()}</div>
              <div className="myds-stat-unit">across all datasets</div>
            </div>
            <div className="myds-stat-card card">
              <div className="myds-stat-label">Datasets Listed</div>
              <div className="myds-stat-value">{myDatasets.length}</div>
              <div className="myds-stat-unit">on Shelbynet</div>
            </div>
          </div>
        )}

        {/* Dataset list */}
        {myDatasets.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <h3>No datasets yet</h3>
            <p>You haven't uploaded any datasets. Upload your first dataset and start earning ShelbyUSD.</p>
            <Link to="/upload" className="btn btn-primary btn-sm">Upload Your First Dataset</Link>
          </div>
        ) : (
          <div className="myds-list">
            {myDatasets.map(ds => (
              <div key={ds.id} className="card myds-card" id={`myds-${ds.id}`}>
                <div className="myds-card-main">
                  <div className="myds-card-info">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <span className="tag">{ds.category}</span>
                      <span className="myds-card-size">{ds.size}</span>
                    </div>
                    <div className="myds-card-name">{ds.name}</div>
                    <div className="myds-card-desc">{ds.description}</div>
                  </div>

                  <div className="myds-card-metrics">
                    <div className="myds-metric">
                      <div className="myds-metric-value">{(Number(ds.price || 0) * (ds.downloads || 0)).toLocaleString()}</div>
                      <div className="myds-metric-label">ShelbyUSD earned</div>
                    </div>
                    <div className="myds-metric">
                      <div className="myds-metric-value">{ds.downloads}</div>
                      <div className="myds-metric-label">Downloads</div>
                    </div>
                    <div className="myds-metric">
                      <div className="myds-metric-value" style={{ color: 'var(--pink)' }}>
                        {ds.price}
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginLeft: 4, fontWeight: 500 }}>SUSD</span>
                      </div>
                      <div className="myds-metric-label">Price / download</div>
                    </div>
                  </div>
                </div>

                <div className="myds-card-actions">
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => setEditTarget(ds)}
                    id={`edit-price-${ds.id}`}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    Edit Price
                  </button>
                  <Link to="/browse" className="btn btn-outline btn-sm">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                      <polyline points="15 3 21 3 21 9"/>
                      <line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                    View Listing
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editTarget && (
        <EditPriceModal
          dataset={editTarget}
          onClose={() => setEditTarget(null)}
          onSave={(price) => handleSavePrice(editTarget.id, price)}
        />
      )}
    </div>
  );
}
