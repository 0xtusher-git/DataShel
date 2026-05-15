import { Buffer } from 'buffer';
window.Buffer = Buffer;
window.process = { env: {} };

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PetraWallet } from "petra-plugin-wallet-adapter";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import ErrorBoundary from './components/ErrorBoundary';
import './index.css'
import App from './App.jsx'

const wallets = [new PetraWallet()];

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <AptosWalletAdapterProvider plugins={wallets} autoConnect={false}>
        <App />
      </AptosWalletAdapterProvider>
    </ErrorBoundary>
  </StrictMode>,
)
