import { useState } from 'react';
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { useWallet } from '../context/WalletContext';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import './DatasetCard.css';

// Initialize Aptos client for Shelbynet
const aptosConfig = new AptosConfig({ 
  fullnode: "https://api.shelbynet.shelby.xyz/v1",
  network: Network.CUSTOM
});
const aptosClient = new Aptos(aptosConfig);

const SHELBY_API_BASE = "https://api.shelbynet.shelby.xyz/shelby";

const CATEGORY_ICONS = {
  Images:  '🖼',
  Text:    '📝',
  Audio:   '🎵',
  Tabular: '📊',
  Other:   '📦',
};

function truncateAddr(addr) {
  if (!addr) return '';
  const s = addr.toString();
  if (s.length <= 12) return s;
  return `${s.slice(0, 6)}...${s.slice(-4)}`;
}

export default function DatasetCard({ dataset }) {
  const { wallet, connect, signAndSubmitTransaction } = useWallet();
  const { recordDownload } = useData();
  const { addToast } = useToast();
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async (e) => {
    e.stopPropagation();
    
    if (!wallet) {
      const ok = await connect();
      if (!ok) return;
    }

    // Block owner from downloading their own dataset
    if (wallet.address.toString() === dataset.uploader) {
      addToast('You cannot download your own dataset', 'error', '🔒');
      return;
    }

    setDownloading(true);
    try {
      addToast('Requesting payment signature…', 'success', '🔑');
      
      const responseTx = await signAndSubmitTransaction({
        data: {
          function: "0x1::aptos_account::transfer",
          typeArguments: [],
          functionArguments: [
            dataset.uploader, // recipient (owner)
            (dataset.price * 100000000).toString() // amount in octas
          ]
        }
      });

      // User approved!
      const txHash = responseTx.hash;
      
      addToast(
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span>Payment confirmed! Starting download...</span>
          <a 
            href={`https://explorer.shelby.xyz/txn/${txHash}?network=testnet`} 
            target="_blank" 
            rel="noreferrer"
            style={{ color: 'white', textDecoration: 'underline', fontSize: '0.75rem' }}
          >
            View Transaction →
          </a>
        </div>, 
        'success', 
        '💰'
      );
      
      // Step 2: Retrieve the data from Shelby Protocol
      const blobPath = dataset.blobPath || `${dataset.uploader}/${dataset.fileName}`;
      const downloadUrl = `${SHELBY_API_BASE}/v1/blobs/${blobPath}`;
      
      const API_KEY = import.meta.env.VITE_SHELBY_API_KEY;
      const headers = {
        'Authorization': `Bearer ${API_KEY}`,
        'x-api-key': API_KEY
      };
      console.log('[DataShel] Sending headers for download:', headers);
      
      const res = await fetch(downloadUrl, {
        headers: headers
      });
      if (!res.ok) throw new Error(`Download failed (${res.status}): ${await res.text()}`);
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = dataset.fileName || `dataset_${dataset.id}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      recordDownload(dataset.id);
      addToast('Download complete! ✓', 'success', '📦');
      
    } catch (error) {
      console.error('Download error:', error);
      if (error.message?.includes('rejected')) {
        addToast('Transaction cancelled', 'error', '✕');
      } else {
        addToast(`Download failed: ${error.message || 'Unknown error'}`, 'error');
      }
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
