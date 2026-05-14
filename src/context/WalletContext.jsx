import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useWallet as useAptosWallet } from '@aptos-labs/wallet-adapter-react';

const WalletContext = createContext(null);

export function WalletProvider({ children }) {
  const { 
    connect: aptosConnect, 
    disconnect: aptosDisconnect, 
    account, 
    network: aptosNetwork, 
    connected,
    connecting: aptosConnecting,
    wallet: currentWallet,
    signAndSubmitTransaction,
    signMessage
  } = useAptosWallet();

  const [wallet, setWallet] = useState(null);
  const [error, setError] = useState(null);
  const [isDetected, setIsDetected] = useState(true);

  // Sync official adapter state with our local context
  useEffect(() => {
    if (connected && account) {
      // Strict null checks for account and network
      const addr = account?.address?.toString();
      const pubKey = account?.publicKey?.toString();
      const netName = aptosNetwork?.name?.toLowerCase();
      const isWrong = !!netName && netName !== 'shelbynet' && netName !== 'custom';
      
      if (isWrong) {
        setError(`Wrong network: ${aptosNetwork?.name}. Please switch to Shelbynet in Petra settings.`);
      } else {
        setError(null);
      }

      setWallet({
        address: addr,
        publicKey: pubKey,
        network: netName || 'Shelbynet',
        isWrongNetwork: isWrong
      });
    } else {
      setWallet(null);
      // Only clear error if not connecting (keeps "Petra not detected" or initial errors visible)
      if (!aptosConnecting && !connected) {
        // setError(null); // Keep error if we want to show "not detected"
      }
    }
  }, [connected, account, aptosNetwork, aptosConnecting]);

  const connect = useCallback(async () => {
    setError(null);
    try {
      // The official adapter handles detection and selection
      await aptosConnect('Petra');
      return true;
    } catch (err) {
      console.error('Wallet connection failed:', err);
      // Specific error handling for the adapter
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || 'Connection failed. Please try again.');
      return false;
    }
  }, [aptosConnect]);

  const disconnect = useCallback(async () => {
    try {
      await aptosDisconnect();
    } catch (_) {}
    setWallet(null);
    setError(null);
  }, [aptosDisconnect]);

  const truncate = (addr) => {
    if (!addr) return '';
    const s = addr.toString();
    return `${s.slice(0, 6)}...${s.slice(-4)}`;
  };

  return (
    <WalletContext.Provider value={{ 
      wallet, 
      connecting: aptosConnecting, 
      connect, 
      disconnect, 
      truncate, 
      error, 
      isDetected,
      signAndSubmitTransaction,
      signMessage
    }}>
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => useContext(WalletContext);
