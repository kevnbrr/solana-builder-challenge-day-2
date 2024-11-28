import React from 'react';
import {
  ConnectionProvider,
  WalletProvider,
  useWallet,
  useConnection,
} from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
// Import the styles directly as a URL
import '@solana/wallet-adapter-react-ui/styles.css';

const network = clusterApiUrl('devnet');

export function WalletContextProvider({ children }: { children: React.ReactNode }) {
  const wallets = React.useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={network}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export function useWalletConnection() {
  const { connection } = useConnection();
  const wallet = useWallet();

  return {
    connection,
    wallet,
    connected: wallet.connected,
    publicKey: wallet.publicKey,
    connect: wallet.connect,
    disconnect: wallet.disconnect,
  };
}