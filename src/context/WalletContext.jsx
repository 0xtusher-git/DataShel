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
    wallet: currentWallet
  } = useAptosWallet();

  const [wallet, setWallet] = useState(null);
  const [error, setError] = useState(null);
  const [isDetected, setIsDetected] = useState(true);

  // Sync official adapter state with our local context
  useEffect(() => {
    if (connected && account) {
      const netName = aptosNetwork?.name;
      const isWrong = netName && netName.toLowerCase() !== 'shelbynet';
      
      if (isWrong) {
        setError(`Wrong network: ${netName}. Please switch to Shelbynet in Petra settings.`);
      } else {
        setError(null);
      }

      setWallet({
        address: account.address,
        publicKey: account.publicKey,
        network: netName || 'Shelbynet',
        isWrongNetwork: isWrong
      });
    } else {
      setWallet(null);
    }
  }, [connected, account, aptosNetwork]);

  const connect = useCallback(async () => {
    setError(null);
    try {
      // The official adapter handles detection
      await aptosConnect('Petra');
      return true;
    } catch (err) {
      console.error('Wallet connection failed:', err);
      setError(err.message || 'Connection failed. Please try again.');
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
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <WalletContext.Provider value={{ 
      wallet, 
      connecting: aptosConnecting, 
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
