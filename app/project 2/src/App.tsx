import React from 'react';
import { Header } from './components/Header';
import { TokenSwap } from './components/TokenSwap';
import { Pools } from './components/Pools';
import { Farm } from './components/Farm';
import { Perpetuals } from './components/perpetuals/Perpetuals';

function App() {
  const [activeTab, setActiveTab] = React.useState<'swap' | 'pools' | 'farm' | 'perpetuals'>('swap');

  return (
    <div className="min-h-screen bg-gray-100">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'swap' && (
          <div className="flex justify-center">
            <TokenSwap />
          </div>
        )}
        {activeTab === 'pools' && <Pools />}
        {activeTab === 'farm' && <Farm />}
        {activeTab === 'perpetuals' && <Perpetuals />}
      </main>
    </div>
  );
}

export default App;