import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PetraWallet } from "petra-plugin-wallet-adapter";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import './index.css'
import App from './App.jsx'

const wallets = [new PetraWallet()];

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AptosWalletAdapterProvider plugins={wallets} autoConnect={true}>
      <App />
    </AptosWalletAdapterProvider>
  </StrictMode>,
)
