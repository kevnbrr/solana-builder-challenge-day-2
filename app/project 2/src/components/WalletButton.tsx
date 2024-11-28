import React from 'react';
import { Wallet } from 'lucide-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useWalletConnection } from '../lib/wallet';
import { cn } from '../lib/utils';

export function WalletButton() {
  const { connected, publicKey, disconnect } = useWalletConnection();
  const { setVisible } = useWalletModal();

  const handleClick = () => {
    if (connected) {
      disconnect();
    } else {
      setVisible(true);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors',
        connected
          ? 'bg-green-100 text-green-700 hover:bg-green-200'
          : 'bg-blue-600 text-white hover:bg-blue-700'
      )}
    >
      <Wallet className="w-5 h-5" />
      <span>
        {connected
          ? `${publicKey?.toBase58().slice(0, 4)}...${publicKey?.toBase58().slice(-4)}`
          : 'Connect Wallet'}
      </span>
    </button>
  );
}