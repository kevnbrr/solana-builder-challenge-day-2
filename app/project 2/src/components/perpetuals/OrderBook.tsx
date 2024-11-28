import React from 'react';
import { formatNumber } from '../../lib/utils';

interface OrderBookEntry {
  price: number;
  size: number;
  total: number;
}

const sampleBids: OrderBookEntry[] = [
  { price: 50000, size: 1.5, total: 75000 },
  { price: 49900, size: 2.3, total: 114770 },
  { price: 49800, size: 3.1, total: 154380 },
];

const sampleAsks: OrderBookEntry[] = [
  { price: 50100, size: 1.2, total: 60120 },
  { price: 50200, size: 2.5, total: 125500 },
  { price: 50300, size: 1.8, total: 90540 },
];

export function OrderBook() {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="grid grid-cols-3 gap-2 p-3 border-b text-sm font-medium">
        <div>Price</div>
        <div>Size</div>
        <div>Total</div>
      </div>
      
      <div className="max-h-[400px] overflow-y-auto">
        {/* Asks */}
        <div className="space-y-1">
          {sampleAsks.map((ask) => (
            <div key={ask.price} className="grid grid-cols-3 gap-2 p-2 text-red-500 text-sm">
              <div>{formatNumber(ask.price)}</div>
              <div>{formatNumber(ask.size)}</div>
              <div>{formatNumber(ask.total)}</div>
            </div>
          ))}
        </div>

        {/* Spread */}
        <div className="p-2 text-center text-sm text-gray-500 border-y">
          Spread: {formatNumber(sampleAsks[0].price - sampleBids[0].price)} ({formatNumber(((sampleAsks[0].price - sampleBids[0].price) / sampleBids[0].price) * 100)}%)
        </div>

        {/* Bids */}
        <div className="space-y-1">
          {sampleBids.map((bid) => (
            <div key={bid.price} className="grid grid-cols-3 gap-2 p-2 text-green-500 text-sm">
              <div>{formatNumber(bid.price)}</div>
              <div>{formatNumber(bid.size)}</div>
              <div>{formatNumber(bid.total)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}