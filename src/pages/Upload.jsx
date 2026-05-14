import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import FaucetPanel from '../components/FaucetPanel';
import './Upload.css';

const CATEGORIES = ['Images', 'Text', 'Audio', 'Tabular', 'Other'];

const STEPS = [
  { id: 1, label: 'Connect Wallet' },
  { id: 2, label: 'Dataset Details' },
  { id: 3, label: 'Pay & Upload' },
];

export default function Upload() {
  const navigate = useNavigate();
  const { wallet, connect, connecting, truncate } = useWallet();
  const { addDataset } = useData();
  const { addToast } = useToast();

  const [form, setForm] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
  });
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showFaucet, setShowFaucet] = useState(false);
  const fileRef = useRef();

  const step = !wallet ? 1 : uploadProgress > 0 ? 3 : 2;

  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer?.files[0] || e.target.files[0];
    if (dropped) setFile(dropped);
  };

  const formatBytes = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const validate = () => {
    if (!form.name.trim())        return 'Dataset name is required.';
    if (!form.category)           return 'Please select a category.';
    if (!form.description.trim()) return 'Description is required.';
    if (!file)                    return 'Please attach a dataset file.';
    if (!form.price || Number(form.price) <= 0) return 'Set a valid price greater than 0.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!wallet) {
      const ok = await connect();
      if (!ok) return;
      return;
    }

    const err = validate();
    if (err) { addToast(err, 'error', '⚠'); return; }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Step 1: Sign storage fee transaction
      addToast('Awaiting wallet signature…', 'success', '🔑');
      await new Promise(r => setTimeout(r, 1000));
      setUploadProgress(15);

      // Step 2: Simulate Shelby storage upload
      addToast('Uploading to Shelby storage…', 'success', '⬆');
      for (let p = 15; p <= 85; p += 10) {
        await new Promise(r => setTimeout(r, 300));
        setUploadProgress(p);
      }

      // Step 3: On-chain registration
      addToast('Registering on Aptos…', 'success', '⛓');
      await new Promise(r => setTimeout(r, 800));
      setUploadProgress(100);

      const ds = addDataset({
        name: form.name.trim(),
        category: form.category,
        description: form.description.trim(),
        size: formatBytes(file.size),
        price: Number(form.price),
        uploader: wallet.address,
        uploads: wallet.address,
      });

      addToast('Dataset uploaded successfully! 🎉', 'success', '✓');
      setTimeout(() => navigate('/my-datasets'), 1500);
    } catch (err) {
      addToast('Upload failed. Please try again.', 'error');
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="page upload-page">
      <div className="container upload-layout">
        {/* Left: Form */}
        <div className="upload-form-col">
          {/* Step indicators */}
          <div className="upload-steps">
            {STEPS.map((s, i) => (
              <div key={s.id} className={`upload-step ${step >= s.id ? 'active' : ''} ${step > s.id ? 'done' : ''}`}>
                <div className="upload-step-num">
                  {step > s.id ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  ) : s.id}
                </div>
                <span className="upload-step-label">{s.label}</span>
                {i < STEPS.length - 1 && <div className="upload-step-line" />}
              </div>
            ))}
          </div>

          <div className="card upload-card">
            <div className="upload-card-header">
              <h1 className="upload-title">Upload Dataset</h1>
              <p className="upload-sub">
                Your dataset will be stored on Shelby Protocol and listed on the marketplace.
              </p>
            </div>

            {!wallet ? (
              <div className="connect-prompt">
                <div className="connect-prompt-icon">🔒</div>
                <h3>Connect your wallet to upload</h3>
                <p>You need a Petra wallet connected to Shelbynet to upload datasets and receive payments.</p>
                <button
                  className="btn btn-primary btn-lg"
                  onClick={connect}
                  disabled={connecting}
                  id="upload-connect-btn"
                  style={{ marginTop: 8 }}
                >
                  {connecting ? 'Connecting…' : 'Connect Petra Wallet'}
                </button>
                <p className="connect-hint">
                  No wallet?{' '}
                  <button className="link-btn" onClick={() => setShowFaucet(true)}>
                    Get started with the faucet →
                  </button>
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                {/* Connected wallet */}
                <div className="wallet-info-bar">
                  <span className="wallet-dot" />
                  <span className="wallet-info-addr">{truncate(wallet.address)}</span>
                  <span className="wallet-info-network">Shelbynet</span>
                </div>

                <div className="form-group">
                  <label htmlFor="dataset-name">Dataset Name</label>
                  <input
                    id="dataset-name"
                    name="name"
                    type="text"
                    className="input"
                    placeholder="e.g. Open Instruction Dataset v3"
                    value={form.name}
                    onChange={handleInput}
                    disabled={uploading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="dataset-category">Category</label>
                  <select
                    id="dataset-category"
                    name="category"
                    className="select"
                    value={form.category}
                    onChange={handleInput}
                    disabled={uploading}
                  >
                    <option value="" disabled>Select a category…</option>
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="dataset-desc">Description</label>
                  <textarea
                    id="dataset-desc"
                    name="description"
                    className="textarea"
                    placeholder="Describe your dataset: contents, format, use-cases, quality, source…"
                    value={form.description}
                    onChange={handleInput}
                    rows={4}
                    disabled={uploading}
                  />
                </div>

                {/* File Drop Zone */}
                <div className="form-group">
                  <label>Dataset File</label>
                  <div
                    className={`drop-zone ${dragOver ? 'drag-over' : ''} ${file ? 'has-file' : ''}`}
                    onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleFileDrop}
                    onClick={() => !uploading && fileRef.current?.click()}
                    id="file-drop-zone"
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => e.key === 'Enter' && fileRef.current?.click()}
                  >
                    <input
                      ref={fileRef}
                      type="file"
                      style={{ display: 'none' }}
                      onChange={handleFileDrop}
                      disabled={uploading}
                      id="file-input"
                    />
                    {file ? (
                      <div className="drop-zone-file">
                        <div className="drop-zone-file-icon">📄</div>
                        <div>
                          <div className="drop-zone-filename">{file.name}</div>
                          <div className="drop-zone-filesize">{formatBytes(file.size)}</div>
                        </div>
                        <button
                          type="button"
                          className="drop-zone-remove"
                          onClick={e => { e.stopPropagation(); setFile(null); }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <div className="drop-zone-idle">
                        <div className="drop-zone-icon">
                          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FF69B4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="17 8 12 3 7 8"/>
                            <line x1="12" y1="3" x2="12" y2="15"/>
                          </svg>
                        </div>
                        <p className="drop-zone-text">
                          Drag & drop your dataset here
                        </p>
                        <p className="drop-zone-hint">or click to browse — ZIP, CSV, JSON, HDF5, etc.</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="dataset-price">Price (ShelbyUSD)</label>
                  <div className="price-input-wrap">
                    <span className="price-prefix">$</span>
                    <input
                      id="dataset-price"
                      name="price"
                      type="number"
                      min="0.01"
                      step="0.01"
                      className="input price-input"
                      placeholder="0.00"
                      value={form.price}
                      onChange={handleInput}
                      disabled={uploading}
                    />
                    <span className="price-suffix">ShelbyUSD</span>
                  </div>
                  <div className="price-hint">
                    You receive 100% of every download payment.
                  </div>
                </div>

                {/* Upload Progress */}
                {uploading && (
                  <div className="upload-progress-wrap">
                    <div className="upload-progress-header">
                      <span className="upload-progress-label">
                        {uploadProgress < 15 ? 'Awaiting signature…'
                          : uploadProgress < 85 ? 'Uploading to Shelby…'
                          : uploadProgress < 100 ? 'Registering on-chain…'
                          : 'Complete!'}
                      </span>
                      <span className="upload-progress-pct">{uploadProgress}%</span>
                    </div>
                    <div className="upload-progress-bar">
                      <div className="upload-progress-fill" style={{ width: `${uploadProgress}%` }} />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary btn-full"
                  disabled={uploading}
                  id="upload-submit-btn"
                  style={{ padding: '14px', fontSize: '0.95rem', marginTop: 4 }}
                >
                  {uploading ? (
                    <>
                      <span className="spinner" style={{ width: 16, height: 16 }} />
                      Uploading to Shelby…
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/>
                        <line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                      Upload to Shelby
                    </>
                  )}
                </button>

                <p className="faucet-prompt-text">
                  Need testnet tokens?{' '}
                  <button type="button" className="link-btn" onClick={() => setShowFaucet(true)}>
                    Claim free ShelbyUSD from faucet →
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>

        {/* Right: Sidebar */}
        <div className="upload-sidebar">
          <FaucetPanel />

          <div className="card sidebar-info-card" style={{ marginTop: 16 }}>
            <h3 className="sidebar-info-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF69B4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              How storage works
            </h3>
            <ul className="sidebar-info-list">
              <li>Your file is content-addressed and stored on Shelby nodes</li>
              <li>A storage fee (small APT amount) covers permanent storage</li>
              <li>The dataset CID is registered on Aptos blockchain</li>
              <li>Buyers pay ShelbyUSD → sent directly to your wallet</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Faucet Modal */}
      {showFaucet && (
        <div className="modal-overlay" onClick={() => setShowFaucet(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: '1.1rem' }}>Get Testnet Tokens</h2>
              <button className="modal-close" onClick={() => setShowFaucet(false)}>✕</button>
            </div>
            <FaucetPanel compact />
          </div>
        </div>
      )}
    </div>
  );
}
