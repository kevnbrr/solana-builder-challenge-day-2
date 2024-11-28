import React from 'react';
import { WalletButton } from './WalletButton';

interface HeaderProps {
  activeTab: 'swap' | 'pools' | 'farm' | 'perpetuals';
  onTabChange: (tab: 'swap' | 'pools' | 'farm' | 'perpetuals') => void;
}

export function Header({ activeTab, onTabChange }: HeaderProps) {
  return (
    <header className="w-full border-b bg-white">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <h1 className="text-xl font-bold">Solana DEX</h1>
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => onTabChange('swap')}
              className={`${
                activeTab === 'swap'
                  ? 'text-blue-600 font-medium'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Swap
            </button>
            <button
              onClick={() => onTabChange('pools')}
              className={`${
                activeTab === 'pools'
                  ? 'text-blue-600 font-medium'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Pools
            </button>
            <button
              onClick={() => onTabChange('farm')}
              className={`${
                activeTab === 'farm'
                  ? 'text-blue-600 font-medium'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Farm
            </button>
            <button
              onClick={() => onTabChange('perpetuals')}
              className={`${
                activeTab === 'perpetuals'
                  ? 'text-blue-600 font-medium'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Perpetuals
            </button>
          </nav>
        </div>
        <WalletButton />
      </div>
    </header>
  );
}