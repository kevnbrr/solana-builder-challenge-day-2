import React from 'react';
import { cn } from '../../lib/utils';
import { TRADING_PAIRS } from '../../lib/constants/tradingPairs';

export function TradeForm() {
  const [side, setSide] = React.useState<'long' | 'short'>('long');
  const [orderType, setOrderType] = React.useState<'market' | 'limit'>('market');
  const [leverage, setLeverage] = React.useState(1);
  const [selectedPair, setSelectedPair] = React.useState(TRADING_PAIRS[0]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
      <div className="flex justify-between items-center">
        <select
          value={selectedPair.symbol}
          onChange={(e) => setSelectedPair(TRADING_PAIRS.find(p => p.symbol === e.target.value)!)}
          className="bg-gray-100 px-3 py-2 rounded-lg"
        >
          {TRADING_PAIRS.map((pair) => (
            <option key={pair.symbol} value={pair.symbol}>
              {pair.symbol}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setSide('long')}
          className={cn(
            'flex-1 py-2 rounded-lg font-medium',
            side === 'long'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          )}
        >
          Long
        </button>
        <button
          onClick={() => setSide('short')}
          className={cn(
            'flex-1 py-2 rounded-lg font-medium',
            side === 'short'
              ? 'bg-red-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          )}
        >
          Short
        </button>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setOrderType('market')}
          className={cn(
            'flex-1 py-2 rounded-lg font-medium',
            orderType === 'market'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          )}
        >
          Market
        </button>
        <button
          onClick={() => setOrderType('limit')}
          className={cn(
            'flex-1 py-2 rounded-lg font-medium',
            orderType === 'limit'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          )}
        >
          Limit
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium text-gray-700">
            Leverage: {leverage}x
          </label>
          <input
            type="number"
            value={leverage}
            onChange={(e) => setLeverage(Math.min(500, Math.max(1, Number(e.target.value))))}
            className="w-20 px-2 py-1 border rounded text-right"
          />
        </div>
        <input
          type="range"
          min="1"
          max="500"
          value={leverage}
          onChange={(e) => setLeverage(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Size ({selectedPair.quoteAsset})
        </label>
        <input
          type="number"
          className="w-full px-3 py-2 border rounded-lg"
          placeholder="0.00"
          min={selectedPair.minQuantity}
          step={selectedPair.tickSize}
        />
      </div>

      {orderType === 'limit' && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Limit Price
          </label>
          <input
            type="number"
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="0.00"
            step={selectedPair.tickSize}
          />
        </div>
      )}

      <div className="space-y-2">
        <div className="flex justify-between">
          <label className="block text-sm font-medium text-gray-700">
            Take Profit
          </label>
          <input
            type="number"
            className="w-32 px-3 py-1 border rounded-lg text-sm"
            placeholder="0.00"
            step={selectedPair.tickSize}
          />
        </div>
        <div className="flex justify-between">
          <label className="block text-sm font-medium text-gray-700">
            Stop Loss
          </label>
          <input
            type="number"
            className="w-32 px-3 py-1 border rounded-lg text-sm"
            placeholder="0.00"
            step={selectedPair.tickSize}
          />
        </div>
      </div>

      <button
        className={cn(
          'w-full py-3 rounded-lg text-white font-medium',
          side === 'long' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
        )}
      >
        {side === 'long' ? 'Long' : 'Short'} {orderType === 'market' ? 'Market' : 'Limit'}
      </button>
    </div>
  );
}