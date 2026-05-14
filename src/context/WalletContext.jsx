import { createContext, useContext, useState, useCallback } from 'react';

const WalletContext = createContext(null);

export function WalletProvider({ children }) {
  const [wallet, setWallet] = useState(null); // { address, network }
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [isDetected, setIsDetected] = useState(typeof window !== 'undefined' && !!window.aptos);

  const checkNetwork = async () => {
    try {
      if (window.aptos) {
        const network = await window.aptos.network();
        // Handle different network return formats (Petra usually returns a string or object)
        const netName = typeof network === 'string' ? network : network?.name;
        return netName;
      }
    } catch (e) {
      console.warn('Network check failed', e);
    }
    return null;
  };

  const connect = useCallback(async () => {
    setConnecting(true);
    setError(null);
    try {
      if (typeof window !== 'undefined' && window.aptos) {
        // Step 1: Connect
        await window.aptos.connect();
        
        // Step 2: Get account
        const acct = await window.aptos.account();
        
        // Step 3: Check network
        const network = await checkNetwork();
        
        if (network && network.toLowerCase() !== 'shelbynet') {
          setError(`Wrong network: ${network}. Please switch to Shelbynet in Petra settings.`);
          setWallet({
            address: acct.address,
            publicKey: acct.publicKey,
            network: network,
            isWrongNetwork: true
          });
          return false;
        }

        setWallet({
          address: acct.address,
          publicKey: acct.publicKey,
          network: network || 'Shelbynet',
          isWrongNetwork: false
        });
        return true;
      } else {
        setError('Petra wallet not detected. Please install it.');
        setIsDetected(false);
        return false;
      }
    } catch (err) {
      console.error('Wallet connection failed:', err);
      setError(err.message || 'Connection failed. Please try again.');
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
    setError(null);
  }, []);

  const truncate = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <WalletContext.Provider value={{ 
      wallet, 
      connecting, 
      connect, 
      disconnect, 
      truncate, 
      error, 
      isDetected 
    }}>
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => useContext(WalletContext);
