import { createContext, useContext, useState, useCallback } from 'react';

const WalletContext = createContext(null);

export function WalletProvider({ children }) {
  const [wallet, setWallet] = useState(null); // { address, network }
  const [connecting, setConnecting] = useState(false);

  const connect = useCallback(async () => {
    setConnecting(true);
    try {
      // Petra Wallet adapter
      if (typeof window !== 'undefined' && window.aptos) {
        const resp = await window.aptos.connect();
        const acct = await window.aptos.account();
        setWallet({
          address: acct.address,
          publicKey: acct.publicKey,
          network: 'Shelbynet',
        });
        return true;
      } else {
        // Petra not installed — open install page
        window.open('https://chromewebstore.google.com/detail/petra-aptos-wallet/ejjladinnckdgjemekebdpeokbikhfci', '_blank');
        return false;
      }
    } catch (err) {
      console.error('Wallet connection failed:', err);
      return false;
    } finally {
      setConnecting(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    try {
      if (window.aptos) await window.aptos.disconnect();
    } catch (_) {}
    setWallet(null);
  }, []);

  const truncate = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <WalletContext.Provider value={{ wallet, connecting, connect, disconnect, truncate }}>
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => useContext(WalletContext);
